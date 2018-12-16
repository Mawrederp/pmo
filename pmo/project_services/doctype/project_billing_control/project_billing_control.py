# -*- coding: utf-8 -*-
# Copyright (c) 2018, s and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _
from frappe.model.document import Document
from frappe.utils import cint, cstr, date_diff, flt, formatdate, getdate, get_link_to_form, \
    comma_or, get_fullname
from frappe import utils


class ProjectBillingControl(Document):
    def before_save(self):
        for row in self.project_payment_schedule_control:
            if row.date_period=='Date' and not row.when:
                frappe.throw("Mandatory field: When in table row {0}".format(row.idx))
            elif row.date_period=='Period' and not row.from_date:
                frappe.throw("Mandatory field: From Date in table row {0}".format(row.idx))
            elif row.date_period=='Period' and not row.to_date:
                frappe.throw("Mandatory field: To Date in table row {0}".format(row.idx))


    # def make_sales_order(self,project_name,scope_item,items_value,billing_percentage,due_date,description_when,vat_value,billing_state,sales_order):
    #   arr=[]
    #   for row in self.project_payment_schedule_control:
    #       if row.invoice==1:
    #           arr.append(row.name)

    #   if sales_order and billing_state==1:
    #       frappe.throw("You make Sales Order for this item before")
    #   else:
    #       if arr and len(arr)==1:
    #           # if not frappe.db.exists("Item", {"item_name": scope_item }):
    #           #   doc = frappe.new_doc("Item")
    #           #   doc.item_group = 'Project'
    #           #   doc.item_code = scope_item
    #           #   doc.item_name = scope_item
    #           #   doc.is_stock_item = 0
    #           #   doc.flags.ignore_mandatory = True
    #           #   doc.insert(ignore_permissions=True)


    #           item_name = frappe.get_value("Item", filters = {"item_name": scope_item}, fieldname = "name")    

    #           customer = frappe.db.sql("select customer from `tabProject Initiation` where name='{0}' ".format(self.project_name))

    #           resources_details_name = frappe.db.sql("select name from `tabResources Details` where parenttype='Project Initiation' and parent='{0}' and section_name='{1}' ".format(self.project_name,scope_item))
    
    #           if customer:
    #               sinv=frappe.get_doc({
    #                   "doctype":"Sales Order",
    #                   "customer": customer[0][0],
    #                   "project": project_name,
    #                   "naming_series": 'SO-',
    #                   "delivery_date": due_date,
    #                   "items": [
    #                         {
    #                           "doctype": "Sales Order Item",
    #                           "item_code": item_name,
    #                           "description": description_when,
    #                           "qty": flt(flt(billing_percentage)/100),
    #                           "rate": items_value
    #                         }
    #                       ],
    #                   "taxes": [
    #                         {
    #                           "doctype": "Sales Taxes and Charges",
    #                           "charge_type": 'Actual',
    #                           "description": description_when,
    #                           "tax_amount": vat_value
    #                         }
    #                       ],
    #                   "taxes_and_charges": "VAT"
    #               })

                    # for resource in resources_details_name:
                    #   doc = frappe.get_doc("Resources Details",resource[0])

                    #   sinv.append("items", {
                    #       "item_code": doc.resources,
                    #       "description": description_when,
                    #       "qty": flt(flt(billing_percentage)/100),
                    #       "rate": items_value
                    #   })

                    #   sinv.append("taxes", {
                    #       "charge_type": 'Actual',
                    #       "description": description_when,
                    #       "tax_amount": vat_value
                    #   })

                    # sinv.flags.ignore_validate = True
        #           sinv.flags.ignore_mandatory = True
        #           sinv.insert(ignore_permissions=True)


        #           frappe.msgprint("Sales Order is created")
        #       else:
        #           frappe.throw('You sould select customer for this project before issue invoice')
        #   else:
        #       frappe.throw("You should check one invoice")

        # return sinv.name
        





    def make_project_sales_order_approval(self):
        sales_approval = frappe.db.sql("select name from `tabProject Sales Order Approval` where project_name='{0}' and docstatus=0".format(self.project_name))

        # status = 1
        # for row in self.project_payment_schedule_control:
        #     resources_details_name = frappe.db.sql("select name from `tabItems Details` where parenttype='Project Initiation' and parent='{0}' and section_name='{1}' ".format(self.project_name,row.scope_item))
        #     for resource in resources_details_name:
        #         item_row = frappe.get_doc("Items Details",resource[0])
        #         doc = frappe.get_doc("Project Items", item_row.items)
                
        #         if doc.status != 'Active':
        #             frappe.msgprint("Project Item {0} under section {1} in row {2} doesnt link to Items,please check: <b><a href='#Form/Project Items/{0}'>{0}</a></b>".format(item_row.items,row.scope_item,row.idx))
        #             status = 0


        # if status==1:
        if not sales_approval:
            psoa=frappe.get_doc({
                "doctype":"Project Sales Order Approval",
                "project_name": self.project_name,
                "project_payment_schedule_control": self.project_payment_schedule_control,
                "workflow_state": "Pending"
            })
        
            arr=[]
            for row in self.project_payment_schedule_control:
                resources_details_name = frappe.db.sql("select name from `tabItems Details` where parenttype='Project Initiation' and parent='{0}' and section_name='{1}' ".format(self.project_name,row.scope_item))
                for resource in resources_details_name:

                    doc = frappe.get_doc("Items Details",resource[0])
                    
                    # psoa.append("project_sales_order_approval_item", {
                    #     "project_items": row.scope_item,
                    #     "item": doc.items
                    # })


                    if str(doc.items)+str(row.scope_item) not in arr:
                        psoa.append("project_sales_order_approval_item", {
                            "project_items": row.scope_item,
                            "item": doc.items
                        })

                        arr.append(str(doc.items)+str(row.scope_item))

            
            psoa.flags.ignore_validate = True
            psoa.flags.ignore_mandatory = True
            psoa.insert(ignore_permissions=True)
        
            frappe.msgprint("Project Sales Order Approval is created: <b><a href='#Form/Project Sales Order Approval/{0}'>{0}</a></b>".format(psoa.name))

            return psoa.name
        else:
            frappe.msgprint("Project Sales Order Approval is already exist for this project, please check: <b><a href='#Form/Project Sales Order Approval/{0}'>{0}</a></b>".format(sales_approval[0][0]))






    # def make_delivery_note(self,project_name,scope_item,items_value,billing_percentage,due_date,description_when,vat_value,billing_state,delivery_note,schedule_bundle_qty_name,is_advance):
    #     arr=[]
    #     for row in self.project_payment_schedule_control:
    #         if row.invoice==1:
    #             arr.append(row.name)

    #     if delivery_note and billing_state==1:
    #         frappe.throw("You made Delivery Note for this item before")
    #     else:
    #         if arr and len(arr)==1:
    #             if is_advance==0:
    #                 vat_account=''
    #                 item_name = frappe.get_value("Project Items", filters = {"name": scope_item}, fieldname = "item")

    #                 customer = frappe.db.sql("select customer from `tabProject Initiation` where name='{0}' ".format(self.project_name))

    #                 resources_details_name = frappe.db.sql("select name from `tabItems Details` where parenttype='Project Initiation' and parent='{0}' and section_name='{1}' ".format(self.project_name,scope_item))
                    
    #                 vat_account_field = frappe.db.sql("select account_head from `tabSales Taxes and Charges` where parent='VAT'")
    #                 if vat_account_field:
    #                     vat_account = vat_account_field[0][0]
 
    #                 # status = 1
    #                 # for row in self.project_payment_schedule_control:
    #                 #     if row.invoice==1:
    #                 #         for resource in resources_details_name:
    #                 #             item_row = frappe.get_doc("Items Details",resource[0])
    #                 #             doc = frappe.get_doc("Project Items", item_row.items)
                                
    #                 #             if doc.status != 'Active':
    #                 #                 frappe.msgprint("Project Item {0} under section {1} in row {2} doesnt link to Items,please check: <b><a href='#Form/Project Items/{0}'>{0}</a></b>".format(item_row.items,row.scope_item,row.idx))
    #                 #                 status = 0


    #                 # if status==1:

    #                 if customer:

    #                     customer_doc = frappe.get_doc("Customer", customer[0][0])

    #                     dnote=frappe.get_doc({
    #                         "doctype":"Delivery Note",
    #                         "customer": customer[0][0],
    #                         "customer_name": customer_doc.customer_name,
    #                         "customer_name_in_arabic": customer_doc.customer_name_in_arabic,
    #                         "project": project_name,
    #                         "project_items": scope_item,
    #                         "naming_series": 'DN-',
    #                         # "workflow_state": 'Pending',
    #                         "posting_date": due_date,
    #                         # "items": [
    #                         #       {
    #                         #         "doctype": "Delivery Note Item",
    #                         #         "item_code": item_name,
    #                         #         "description": description,
    #                         #         "qty": flt(flt(billing_percentage)/100),
    #                         #         "rate": items_value
    #                         #       }
    #                         #     ],
    #                         # "taxes": [
    #                         #       {
    #                         #         "doctype": "Sales Taxes and Charges",
    #                         #         "charge_type": 'Actual',
    #                         #         "description": description,
    #                         #         "tax_amount": vat_value
    #                         #       }
    #                         #     ],
    #                         "taxes_and_charges": "VAT"
    #                     })

    #                     for resource in resources_details_name:
                            
    #                         doc = frappe.get_doc("Items Details",resource[0])
    #                         # proj_item = frappe.get_doc("Project Items", doc.items)
    #                         item = frappe.get_doc("Item", doc.items)

    #                         description=item.description

    #                         rate = doc.final_selling_price
    #                         # qty = 1

    #                         required_qty = frappe.db.sql("select qty from `tabProject Payment Schedule Bundle QTY` where parenttype='Project Billing Control' and parent='{0}' and parent_name='{1}' and item='{2}'".format(self.name,schedule_bundle_qty_name,doc.items))[0][0]

    #                         # if flt(doc.quantity)>0:
    #                         #     rate = doc.final_selling_price/flt(doc.quantity)
    #                         #     qty = doc.quantity


    #                         rate = doc.final_selling_price/flt(doc.quantity)

    #                         dnote.append("items", {
    #                             "item_code": doc.items,
    #                             "description": description,
    #                             # "qty": flt(qty)*flt(flt(billing_percentage)/100),
    #                             "qty": flt(required_qty),
    #                             # "qty": 0,
    #                             "rate": rate
    #                         })

    #                         dnote.append("taxes", {
    #                             "charge_type": 'Actual',
    #                             "account_head": vat_account,
    #                             "description": description,
    #                             "tax_amount": (doc.final_selling_price*0.05)*flt(flt(billing_percentage)/100)
    #                         })


    #                         product_bundle = frappe.db.sql("""select t1.item_code, t1.qty, t1.uom, t1.description
    #                             from `tabProduct Bundle Item` t1, `tabProduct Bundle` t2
    #                             where t2.new_item_code=%s and t1.parent = t2.name order by t1.idx""", doc.items, as_dict=1)

    #                         for bundle in product_bundle:
    #                             item_bundle = frappe.get_doc("Item", bundle.item_code)

    #                             dnote.append("items", {
    #                                 "item_code": bundle.item_code,
    #                                 "item_name": bundle.item_name,
    #                                 "description": bundle.description,
    #                                 "uom": bundle.uom,
    #                                 "qty": flt(bundle.qty)*flt(required_qty),
    #                                 # "qty": flt(bundle.qty),
    #                                 "project": project_name,
    #                                 "warehouse": item_bundle.default_warehouse,
    #                                 "schedule_date": frappe.utils.get_last_day(utils.today()),
    #                                 "is_product_bundle_item": 1 ,
    #                                 "product_bundle": doc.items
    #                             })


    #                     # dnote.flags.ignore_validate = True
    #                     dnote.flags.ignore_mandatory = True
    #                     dnote.insert(ignore_permissions=True)
    #                     return dnote.name

    #                     frappe.msgprint("Delivery Note is created: <b><a href='#Form/Delivery Note/{0}'>{0}</a></b>".format(dnote.name))
    #                 else:
    #                     frappe.throw('You sould select customer for this project before issue an invoice')
    #             else:
    #                 frappe.throw("This is Advance Payment, Please click Make Sales invoice instead")
    #         else:
    #             frappe.throw("You should check one invoice")







    def make_delivery_note(self,items,scope_item,project_name,items_value,billing_percentage,due_date,description_when,vat_value,billing_state,delivery_note,schedule_bundle_qty_name,is_advance):
        # item[0] = scope_item
        # item[1] = project_name
        # item[2] = items_value
        # item[3] = billing_percentage
        # item[4] = due_date
        # item[5] = description_when
        # item[6] = vat_value
        # item[7] = billing_state
        # item[8] = delivery_note
        # item[9] = schedule_bundle_qty_name
        # item[10] = is_advance
        # item[11] = total_billing_value
        # item[12] = remaining_billing_value
        # item[13] = project_payment_schedule

        arr=[]
        for row in self.project_payment_schedule_control:
            if row.invoice==1:
                arr.append(row.name)

        if delivery_note and billing_state==1:
            frappe.throw("You made Delivery Note for this item before")
        else:
            if arr :
                if is_advance==0:
                    vat_account=''
                    item_name = frappe.get_value("Project Items", filters = {"name": scope_item}, fieldname = "item")

                    customer = frappe.db.sql("select customer from `tabProject Initiation` where name='{0}' ".format(self.project_name))

                    vat_account_field = frappe.db.sql("select account_head from `tabSales Taxes and Charges` where parent='VAT'")
                    if vat_account_field:
                        vat_account = vat_account_field[0][0]


                    if customer:

                        customer_doc = frappe.get_doc("Customer", customer[0][0])

                        dnote=frappe.get_doc({
                            "doctype":"Delivery Note",
                            "customer": customer[0][0],
                            "customer_name": customer_doc.customer_name,
                            "customer_name_in_arabic": customer_doc.customer_name_in_arabic,
                            "project": project_name,
                            # "project_items": scope_item,
                            "naming_series": 'DN-',
                            "posting_date": due_date,
                            "taxes_and_charges": "VAT"
                        })

                        for item in items:
                            if item[10]==0:
                                resources_details_name = frappe.db.sql("select name from `tabItems Details` where parenttype='Project Initiation' and parent='{0}' and section_name='{1}' ".format(self.project_name,item[0]))
                        
                                for resource in resources_details_name:
                                    
                                    doc = frappe.get_doc("Items Details",resource[0])

                                    item_name = frappe.get_doc("Item", doc.items)

                                    if description_when:
                                        description=description_when
                                    elif item_name.description:
                                        description=item_name.description
                                    else:
                                        description=doc.items

                                    rate = doc.final_selling_price

                                    required_qty = frappe.db.sql("select qty from `tabProject Payment Schedule Bundle QTY` where parenttype='Project Billing Control' and parent='{0}' and parent_name='{1}' and item='{2}'".format(self.name,item[9],doc.items))[0][0]
                                    if flt(required_qty) == 0:
                                        required_qty = 1

                                    rate = doc.final_selling_price/flt(doc.quantity)

                                    dnote.append("items", {
                                        "item_code": doc.items,
                                        "description": description,
                                        "project_payment_schedule": item[13],
                                        "qty": flt(required_qty),
                                        "rate": rate
                                    })

                                    dnote.append("taxes", {
                                        "charge_type": 'Actual',
                                        "account_head": vat_account,
                                        "description": description,
                                        "tax_amount": (doc.final_selling_price*0.05)*flt(flt(item[3])/100)
                                    })


                                    product_bundle = frappe.db.sql("""select t1.item_code, t1.qty, t1.uom, t1.description
                                        from `tabProduct Bundle Item` t1, `tabProduct Bundle` t2
                                        where t2.new_item_code=%s and t1.parent = t2.name order by t1.idx""", doc.items, as_dict=1)

                                    for bundle in product_bundle:
                                        item_bundle = frappe.get_doc("Item", bundle.item_code)

                                        dnote.append("items", {
                                            "item_code": bundle.item_code,
                                            "item_name": bundle.item_name,
                                            "description": bundle.description,
                                            "uom": bundle.uom,
                                            "qty": flt(bundle.qty)*flt(required_qty),
                                            "project": item[1],
                                            "warehouse": item_bundle.default_warehouse,
                                            "schedule_date": frappe.utils.get_last_day(utils.today()),
                                            "is_product_bundle_item": 1 ,
                                            "product_bundle": doc.items
                                        })
                            else:
                                frappe.throw("This is Advance Payment, Please click Make Sales invoice instead")

                        for schedule_control in self.project_payment_schedule_control:
                            if schedule_control.invoice == 1:
                                dnote.append("project_payment_schedule_delivery", {
                                    "scope_item": schedule_control.scope_item,
                                    "items_value": schedule_control.items_value,
                                    "billing_percentage": schedule_control.billing_percentage,
                                    "number_of_invoices": schedule_control.number_of_invoices,
                                    "vat": schedule_control.vat,
                                    "vat_value": schedule_control.vat_value,
                                    "total_billing_value": schedule_control.total_billing_value,
                                    "remaining_billing_value": schedule_control.remaining_billing_value,
                                    "remaining_billing_percent": schedule_control.remaining_billing_percent,
                                    "delivery_note": schedule_control.delivery_note,
                                    "sales_invoice": schedule_control.sales_invoice,
                                    "is_advance": schedule_control.is_advance,
                                    "advanced_item": schedule_control.advanced_item,
                                    "advance_project_items": schedule_control.advance_project_items,
                                    "project_item_price": schedule_control.project_item_price,
                                    "advance_percent": schedule_control.advance_percent,
                                    "billing_status": schedule_control.billing_status,
                                    "invoice": schedule_control.invoice,
                                    "date_period": schedule_control.date_period,
                                    "when": schedule_control.when,
                                    "from_date": schedule_control.from_date,
                                    "to_date": schedule_control.to_date,
                                    "billing_value": schedule_control.billing_value,
                                    "description_when": schedule_control.description_when,
                                    "created_done": schedule_control.created_done,
                                    "old_name": schedule_control.old_name
                                })

                        dnote.flags.ignore_mandatory = True
                        dnote.insert(ignore_permissions=True)
                        return dnote.name

                        frappe.msgprint("Delivery Note is created: <b><a href='#Form/Delivery Note/{0}'>{0}</a></b>".format(dnote.name))
                    else:
                        frappe.throw('You sould select customer for this project before issue an invoice')
                else:
                    frappe.throw("This is Advance Payment, Please click Make Sales invoice instead")





    def make_sales_invoice(self,items,project_name,scope_item,items_value,billing_percentage,sales_invoice,due_date,description_when,vat_value,billing_state,delivery_note,schedule_bundle_qty_name,is_advance,advanced_item,billing_value):
        # item[0] = scope_item
        # item[1] = project_name
        # item[2] = items_value
        # item[3] = billing_percentage
        # item[4] = due_date
        # item[5] = description_when
        # item[6] = vat_value
        # item[7] = billing_state
        # item[8] = delivery_note
        # item[9] = schedule_bundle_qty_name
        # item[10] = is_advance
        # item[11] = sales_invoice
        # item[12] = advanced_item
        # item[13] = billing_value
        # item[14] = total_billing_value
        # item[15] = remaining_billing_value
        # item[16] = project_schedule_name
        # item[17] = advance_project_items

        arr=[]
        for row in self.project_payment_schedule_control:
            if row.invoice==1:
                arr.append(row.name)

        if sales_invoice and billing_state==1:
            frappe.throw("You made Sales Invoice for this item before")
        else:
            if arr :
                if is_advance==1:
                    vat_account=''
                    item_name = frappe.get_value("Project Items", filters = {"name": scope_item}, fieldname = "item")

                    customer = frappe.db.sql("select customer from `tabProject Initiation` where name='{0}' ".format(self.project_name))

                    vat_account_field = frappe.db.sql("select account_head from `tabSales Taxes and Charges` where parent='VAT'")
                    if vat_account_field:
                        vat_account = vat_account_field[0][0]

                    if customer:

                        customer_doc = frappe.get_doc("Customer", customer[0][0])

                        dnote=frappe.get_doc({
                            "doctype":"Sales Invoice",
                            "customer": customer[0][0],
                            "customer_referance": customer[0][0],
                            "customer_name": customer_doc.customer_name,
                            "customer_name_in_arabic": customer_doc.customer_name_in_arabic,
                            "project": project_name,
                            # "project_items": scope_item,
                            "naming_series": 'SINV-',
                            "workflow_state": 'Pending(f)',
                            "posting_date": due_date,
                            "delivery_date": due_date,
                            "is_advance": is_advance,
                            "taxes_and_charges": "VAT"
                        })

                        for item in items:
                            if item[10]==1:

                                for payment_item in self.project_payment_schedule_control:
                                    if payment_item.scope_item == item[17]:
                                        if payment_item.billing_status!=1 and payment_item.is_advance!=1:
                                            frappe.throw("You must make invoice with linked advance item before")


                                # resources_details_name = frappe.db.sql("select name from `tabItems Details` where parenttype='Project Initiation' and parent='{0}' and section_name='{1}' ".format(self.project_name,item[0]))

                                # for resource in resources_details_name:
                                    
                                    # doc = frappe.get_doc("Items Details",resource[0])
                                    # item_name = frappe.get_doc("Item", doc.items)

                                    # description=item_name.description

                                    # rate = doc.final_selling_price

                                    # required_qty = frappe.db.sql("select qty from `tabProject Payment Schedule Bundle QTY` where parenttype='Project Billing Control' and parent='{0}' and parent_name='{1}' and item='{2}'".format(self.name,item[9],doc.items))[0][0]

                                    # rate = doc.final_selling_price/flt(doc.quantity)

                                required_qty = 1

                                dnote.append("items", {
                                    "item_code": item[12],
                                    "description": item[5],
                                    "project_payment_schedule": item[16],
                                    "qty": flt(flt(item[3])/100),
                                    "rate": item[13]
                                })

                                dnote.append("taxes", {
                                    "charge_type": 'Actual',
                                    "account_head": vat_account,
                                    "description": item[5],
                                    "tax_amount": item[6]
                                })


                                product_bundle = frappe.db.sql("""select t1.item_code, t1.qty, t1.uom, t1.description
                                    from `tabProduct Bundle Item` t1, `tabProduct Bundle` t2
                                    where t2.new_item_code=%s and t1.parent = t2.name order by t1.idx""", item[12], as_dict=1)

                                for bundle in product_bundle:
                                    item_bundle = frappe.get_doc("Item", bundle.item_code)

                                    dnote.append("items", {
                                        "item_code": bundle.item_code,
                                        "item_name": bundle.item_name,
                                        "description": bundle.description,
                                        "uom": bundle.uom,
                                        "qty": flt(bundle.qty)*flt(required_qty),
                                        "project": item[1],
                                        "warehouse": item_bundle.default_warehouse,
                                        "schedule_date": frappe.utils.get_last_day(utils.today()),
                                        "is_product_bundle_item": 1 ,
                                        "product_bundle": doc.items
                                    })

                            else:
                                frappe.throw("This is Not an Advance Payment, Please click Make Delivery Note instead")

                        for schedule_control in self.project_payment_schedule_control:
                            if schedule_control.invoice == 1:
                                dnote.append("project_payment_schedule_invoice", {
                                    "scope_item": schedule_control.scope_item,
                                    "items_value": schedule_control.items_value,
                                    "billing_percentage": schedule_control.billing_percentage,
                                    "number_of_invoices": schedule_control.number_of_invoices,
                                    "vat": schedule_control.vat,
                                    "vat_value": schedule_control.vat_value,
                                    "total_billing_value": schedule_control.total_billing_value,
                                    "remaining_billing_value": schedule_control.remaining_billing_value,
                                    "remaining_billing_percent": schedule_control.remaining_billing_percent,
                                    "delivery_note": schedule_control.delivery_note,
                                    "sales_invoice": schedule_control.sales_invoice,
                                    "is_advance": schedule_control.is_advance,
                                    "advanced_item": schedule_control.advanced_item,
                                    "advance_project_items": schedule_control.advance_project_items,
                                    "project_item_price": schedule_control.project_item_price,
                                    "advance_percent": schedule_control.advance_percent,
                                    "billing_status": schedule_control.billing_status,
                                    "invoice": schedule_control.invoice,
                                    "date_period": schedule_control.date_period,
                                    "when": schedule_control.when,
                                    "from_date": schedule_control.from_date,
                                    "to_date": schedule_control.to_date,
                                    "billing_value": schedule_control.billing_value,
                                    "description_when": schedule_control.description_when,
                                    "created_done": schedule_control.created_done,
                                    "old_name": schedule_control.old_name
                                })

                        dnote.flags.ignore_mandatory = True
                        dnote.insert(ignore_permissions=True)
                        return dnote.name

                        frappe.msgprint("Sales Invoice is created: <b><a href='#Form/Sales Invoice/{0}'>{0}</a></b>".format(dnote.name))
                    else:
                        frappe.throw('You sould select customer for this project before issue an invoice')
                else:
                    frappe.throw("This is Not an Advance Payment, Please click Make Delivery Note instead")
            else:
                frappe.throw("You should check one invoice")







    def make_hybrid_invoice(self,items,project_name,scope_item,items_value,billing_percentage,sales_invoice,due_date,description_when,vat_value,billing_state,delivery_note,schedule_bundle_qty_name,is_advance,advanced_item,billing_value):
        # item[0] = scope_item
        # item[1] = project_name
        # item[2] = items_value
        # item[3] = billing_percentage
        # item[4] = due_date
        # item[5] = description_when
        # item[6] = vat_value
        # item[7] = billing_state
        # item[8] = delivery_note
        # item[9] = schedule_bundle_qty_name
        # item[10] = is_advance
        # item[11] = sales_invoice
        # item[12] = advanced_item
        # item[13] = billing_value
        # item[14] = total_billing_value
        # item[15] = remaining_billing_value
        # item[16] = project_schedule_name

        arr=[]
        for row in self.project_payment_schedule_control:
            if row.invoice==1:
                arr.append(row.name)

        if sales_invoice and billing_state==1:
            frappe.throw("You made Sales Invoice for this item before")
        else:
            if arr :
                vat_account=''
                item_name = frappe.get_value("Project Items", filters = {"name": scope_item}, fieldname = "item")

                customer = frappe.db.sql("select customer from `tabProject Initiation` where name='{0}' ".format(self.project_name))

                vat_account_field = frappe.db.sql("select account_head from `tabSales Taxes and Charges` where parent='VAT'")
                if vat_account_field:
                    vat_account = vat_account_field[0][0]

                if customer:

                    customer_doc = frappe.get_doc("Customer", customer[0][0])

                    dnote=frappe.get_doc({
                        "doctype":"Sales Invoice",
                        "customer": customer[0][0],
                        "customer_referance": customer[0][0],
                        "customer_name": customer_doc.customer_name,
                        "customer_name_in_arabic": customer_doc.customer_name_in_arabic,
                        "project": project_name,
                        # "project_items": scope_item,
                        "naming_series": 'SINV-',
                        "workflow_state": 'Pending(f)',
                        "posting_date": due_date,
                        "delivery_date": due_date,
                        "is_advance": is_advance,
                        "taxes_and_charges": "VAT"
                    })

                    for item in items:

                        resources_details_name = frappe.db.sql("select name from `tabItems Details` where parenttype='Project Initiation' and parent='{0}' and section_name='{1}' ".format(self.project_name,item[0]))

                        if item[10]==1:

                            # for resource in resources_details_name:
                                
                            #     doc = frappe.get_doc("Items Details",resource[0])
                            #     item_name = frappe.get_doc("Item", doc.items)

                            #     description=item_name.description

                            #     rate = doc.final_selling_price

                            #     required_qty = frappe.db.sql("select qty from `tabProject Payment Schedule Bundle QTY` where parenttype='Project Billing Control' and parent='{0}' and parent_name='{1}' and item='{2}'".format(self.name,item[9],doc.items))[0][0]

                            #     rate = doc.final_selling_price/flt(doc.quantity)

                            required_qty = 1

                            dnote.append("items", {
                                "item_code": item[12],
                                "description": item[5],
                                "project_payment_schedule": item[16],
                                "qty": flt(flt(item[3])/100),
                                "rate": item[13]
                            })

                            dnote.append("taxes", {
                                "charge_type": 'Actual',
                                "account_head": vat_account,
                                "description": item[5],
                                "tax_amount": item[6]
                            })


                            product_bundle = frappe.db.sql("""select t1.item_code, t1.qty, t1.uom, t1.description
                                from `tabProduct Bundle Item` t1, `tabProduct Bundle` t2
                                where t2.new_item_code=%s and t1.parent = t2.name order by t1.idx""", item[12], as_dict=1)

                            for bundle in product_bundle:
                                item_bundle = frappe.get_doc("Item", bundle.item_code)

                                dnote.append("items", {
                                    "item_code": bundle.item_code,
                                    "item_name": bundle.item_name,
                                    "description": bundle.description,
                                    "uom": bundle.uom,
                                    "qty": flt(bundle.qty)*flt(required_qty),
                                    "project": item[1],
                                    "warehouse": item_bundle.default_warehouse,
                                    "schedule_date": frappe.utils.get_last_day(utils.today()),
                                    "is_product_bundle_item": 1 ,
                                    "product_bundle": doc.items
                                })
                        else:

                            if item[10]!=1 and not item[8]:
                                frappe.throw("You must make delivery note with item {0} before making hybrid invoice".format(item[0]))
                    
                            for resource in resources_details_name:
                                
                                doc = frappe.get_doc("Items Details",resource[0])

                                item_name = frappe.get_doc("Item", doc.items)

                                if description_when:
                                    description=description_when
                                elif item_name.description:
                                    description=item_name.description
                                else:
                                    description=doc.items

                                rate = doc.final_selling_price

                                required_qty = frappe.db.sql("select qty from `tabProject Payment Schedule Bundle QTY` where parenttype='Project Billing Control' and parent='{0}' and parent_name='{1}' and item='{2}'".format(self.name,item[9],doc.items))[0][0]
                                if flt(required_qty) == 0:
                                    required_qty = 1

                                rate = doc.final_selling_price/flt(doc.quantity)

                                dnote.append("items", {
                                    "item_code": doc.items,
                                    "description": description,
                                    "delivery_note": item[8],
                                    "project_payment_schedule": item[16],
                                    "qty": flt(required_qty),
                                    "rate": rate
                                })

                                dnote.append("taxes", {
                                    "charge_type": 'Actual',
                                    "account_head": vat_account,
                                    "description": description,
                                    "tax_amount": (doc.final_selling_price*0.05)*flt(flt(item[3])/100)
                                })


                                product_bundle = frappe.db.sql("""select t1.item_code, t1.qty, t1.uom, t1.description
                                    from `tabProduct Bundle Item` t1, `tabProduct Bundle` t2
                                    where t2.new_item_code=%s and t1.parent = t2.name order by t1.idx""", doc.items, as_dict=1)

                                for bundle in product_bundle:
                                    item_bundle = frappe.get_doc("Item", bundle.item_code)

                                    dnote.append("items", {
                                        "item_code": bundle.item_code,
                                        "item_name": bundle.item_name,
                                        "description": bundle.description,
                                        "uom": bundle.uom,
                                        "qty": flt(bundle.qty)*flt(required_qty),
                                        "project": item[1],
                                        "warehouse": item_bundle.default_warehouse,
                                        "schedule_date": frappe.utils.get_last_day(utils.today()),
                                        "is_product_bundle_item": 1 ,
                                        "product_bundle": doc.items
                                    })

                    for schedule_control in self.project_payment_schedule_control:
                        if schedule_control.invoice == 1:
                            dnote.append("project_payment_schedule_invoice", {
                                "scope_item": schedule_control.scope_item,
                                "items_value": schedule_control.items_value,
                                "billing_percentage": schedule_control.billing_percentage,
                                "number_of_invoices": schedule_control.number_of_invoices,
                                "vat": schedule_control.vat,
                                "vat_value": schedule_control.vat_value,
                                "total_billing_value": schedule_control.total_billing_value,
                                "remaining_billing_value": schedule_control.remaining_billing_value,
                                "remaining_billing_percent": schedule_control.remaining_billing_percent,
                                "delivery_note": schedule_control.delivery_note,
                                "sales_invoice": schedule_control.sales_invoice,
                                "is_advance": schedule_control.is_advance,
                                "advanced_item": schedule_control.advanced_item,
                                "advance_project_items": schedule_control.advance_project_items,
                                "project_item_price": schedule_control.project_item_price,
                                "advance_percent": schedule_control.advance_percent,
                                "billing_status": schedule_control.billing_status,
                                "invoice": schedule_control.invoice,
                                "date_period": schedule_control.date_period,
                                "when": schedule_control.when,
                                "from_date": schedule_control.from_date,
                                "to_date": schedule_control.to_date,
                                "billing_value": schedule_control.billing_value,
                                "description_when": schedule_control.description_when,
                                "created_done": schedule_control.created_done,
                                "old_name": schedule_control.old_name
                            })

                    dnote.flags.ignore_mandatory = True
                    dnote.insert(ignore_permissions=True)
                    return dnote.name

                    frappe.msgprint("Sales Invoice is created: <b><a href='#Form/Sales Invoice/{0}'>{0}</a></b>".format(dnote.name))
                else:
                    frappe.throw('You sould select customer for this project before issue an invoice')
            else:
                frappe.throw("You should check one invoice")






    # def make_sales_invoice(self,project_name,scope_item,items_value,billing_percentage,sales_invoice,due_date,description_when,vat_value,billing_state,delivery_note,schedule_bundle_qty_name,is_advance,advanced_item,billing_value):
    #     arr=[]
    #     for row in self.project_payment_schedule_control:
    #         if row.invoice==1:
    #             arr.append(row.name)

    #     if sales_invoice and billing_state==1:
    #         frappe.throw("You made Sales Invoice for this item before")
    #     else:
    #         if arr and len(arr)==1:
    #             if is_advance==1:
    #                 vat_account=''
    #                 item_name = frappe.get_value("Project Items", filters = {"name": scope_item}, fieldname = "item")

    #                 customer = frappe.db.sql("select customer from `tabProject Initiation` where name='{0}' ".format(self.project_name))

    #                 resources_details_name = frappe.db.sql("select name from `tabItems Details` where parenttype='Project Initiation' and parent='{0}' and section_name='{1}' ".format(self.project_name,scope_item))
    #                 vat_account_field = frappe.db.sql("select account_head from `tabSales Taxes and Charges` where parent='VAT'")
    #                 if vat_account_field:
    #                     vat_account = vat_account_field[0][0]
 
    #                 if customer:

    #                     customer_doc = frappe.get_doc("Customer", customer[0][0])

    #                     dnote=frappe.get_doc({
    #                         "doctype":"Sales Invoice",
    #                         "customer": customer[0][0],
    #                         "customer_referance": customer[0][0],
    #                         "customer_name": customer_doc.customer_name,
    #                         "customer_name_in_arabic": customer_doc.customer_name_in_arabic,
    #                         "project": project_name,
    #                         "project_items": scope_item,
    #                         "naming_series": 'SINV-',
    #                         "workflow_state": 'Pending(f)',
    #                         "posting_date": due_date,
    #                         "delivery_date": due_date,
    #                         "is_advance": is_advance,
    #                         "items": [
    #                               {
    #                                 "doctype": "Sales Invoice Item",
    #                                 "item_code": advanced_item,
    #                                 "description": description_when,
    #                                 "qty": flt(flt(billing_percentage)/100),
    #                                 "rate": billing_value
    #                               }
    #                             ],
    #                         "taxes": [
    #                               {
    #                                 "doctype": "Sales Taxes and Charges",
    #                                 "charge_type": 'Actual',
    #                                 "account_head": vat_account,
    #                                 "description": description_when,
    #                                 "tax_amount": vat_value
    #                               }
    #                             ],
    #                         "taxes_and_charges": "VAT"
    #                     })



    #                     # for resource in resources_details_name:
                            
    #                     #     doc = frappe.get_doc("Items Details",resource[0])
    #                     #     # proj_item = frappe.get_doc("Project Items", doc.items)
    #                     #     item = frappe.get_doc("Item", doc.items)

    #                     #     description=item.description

    #                     #     rate = doc.final_selling_price
    #                     #     # qty = 1

    #                     #     required_qty = frappe.db.sql("select qty from `tabProject Payment Schedule Bundle QTY` where parenttype='Project Billing Control' and parent='{0}' and parent_name='{1}' and item='{2}'".format(self.name,schedule_bundle_qty_name,doc.items))[0][0]

    #                     #     # if flt(doc.quantity)>0:
    #                     #     #     rate = doc.final_selling_price/flt(doc.quantity)
    #                     #     #     qty = doc.quantity


    #                     #     rate = doc.final_selling_price/flt(doc.quantity)

    #                     #     dnote.append("items", {
    #                     #         "item_code": doc.items,
    #                     #         "description": description,
    #                     #         # "qty": flt(qty)*flt(flt(billing_percentage)/100),
    #                     #         "qty": flt(required_qty),
    #                     #         # "qty": 0,
    #                     #         "rate": rate
    #                     #     })

    #                     #     dnote.append("taxes", {
    #                     #         "charge_type": 'Actual',
    #                     #         "account_head": vat_account,
    #                     #         "description": description,
    #                     #         "tax_amount": (doc.final_selling_price*0.05)*flt(flt(billing_percentage)/100)
    #                     #     })


    #                     #     product_bundle = frappe.db.sql("""select t1.item_code, t1.qty, t1.uom, t1.description
    #                     #         from `tabProduct Bundle Item` t1, `tabProduct Bundle` t2
    #                     #         where t2.new_item_code=%s and t1.parent = t2.name order by t1.idx""", doc.items, as_dict=1)

    #                     #     for bundle in product_bundle:
    #                     #         item_bundle = frappe.get_doc("Item", bundle.item_code)

    #                     #         dnote.append("items", {
    #                     #             "item_code": bundle.item_code,
    #                     #             "item_name": bundle.item_name,
    #                     #             "description": bundle.description,
    #                     #             "uom": bundle.uom,
    #                     #             "qty": flt(bundle.qty)*flt(required_qty),
    #                     #             # "qty": flt(bundle.qty),
    #                     #             "project": project_name,
    #                     #             "warehouse": item_bundle.default_warehouse,
    #                     #             "schedule_date": frappe.utils.get_last_day(utils.today()),
    #                     #             "is_product_bundle_item": 1 ,
    #                     #             "product_bundle": doc.items
    #                     #         })

    #                     # dnote.flags.ignore_validate = True
    #                     dnote.flags.ignore_mandatory = True
    #                     dnote.insert(ignore_permissions=True)
    #                     return dnote.name

    #                     frappe.msgprint("Sales Invoice is created: <b><a href='#Form/Sales Invoice/{0}'>{0}</a></b>".format(dnote.name))
    #                 else:
    #                     frappe.throw('You sould select customer for this project before issue an invoice')
    #             else:
    #                 frappe.throw("This is Not an Advance Payment, Please click Make Delivery Note instead")
    #         else:
    #             frappe.throw("You should check one invoice")




    # def updat_init_payment_table_delivery_note(self,delivery_note,scope_item,billing_percentage,total_billing_value,remaining_billing_value):
    #     init_payment_name = ''
    #     init_payment_name = frappe.db.sql("""
    #     select payment.name from `tabProject Payment Schedule` payment join `tabProject Initiation` init on payment.parent=init.name
    #     where payment.parenttype='Project Initiation' and init.name='{0}' and payment.scope_item='{1}'
    #     and payment.billing_percentage='{2}' and payment.total_billing_value='{3}' and payment.remaining_billing_value='{4}'
    #     """.format(self.project_name,scope_item,billing_percentage,total_billing_value,remaining_billing_value)) 
    #     if init_payment_name:
    #         init_payment_name=init_payment_name[0][0]

    #     doc = frappe.get_doc("Project Payment Schedule",init_payment_name)
    #     if doc.scope_item==scope_item and doc.billing_percentage==billing_percentage and doc.total_billing_value==total_billing_value and doc.remaining_billing_value==remaining_billing_value:
    #         doc.delivery_note = delivery_note
    #         doc.billing_status = 1
    #         doc.flags.ignore_mandatory = True
    #         doc.save(ignore_permissions=True)

    #     return init_payment_name



    def updat_init_payment_table_delivery_note(self,items,delivery_note,scope_item,billing_percentage,total_billing_value,remaining_billing_value):
        for item in items:
            init_payment_name = ''
            init_payment_name = frappe.db.sql("""
            select payment.name from `tabProject Payment Schedule` payment join `tabProject Initiation` init on payment.parent=init.name
            where payment.parenttype='Project Initiation' and init.name='{0}' and payment.scope_item='{1}'
            and payment.billing_percentage='{2}' and payment.total_billing_value='{3}' and payment.remaining_billing_value='{4}'
            """.format(self.project_name,item[0],item[3],item[11],item[12])) 
            if init_payment_name:
                init_payment_name=init_payment_name[0][0]


            print '***********************************'
            print item
            print init_payment_name
            print '***********************************'

            doc = frappe.get_doc("Project Payment Schedule",init_payment_name)
            if doc.scope_item==item[0] and doc.billing_percentage==item[3] and doc.total_billing_value==item[11] and doc.remaining_billing_value==item[12]:
                doc.delivery_note = delivery_note
                doc.billing_status = 1
                doc.flags.ignore_mandatory = True
                doc.save(ignore_permissions=True)

        return init_payment_name






    def updat_init_payment_table_sales_invoice(self,items,sales_invoice,scope_item,billing_percentage,total_billing_value,remaining_billing_value):
        for item in items:
            init_payment_name = ''
            init_payment_name = frappe.db.sql("""
            select payment.name from `tabProject Payment Schedule` payment join `tabProject Initiation` init on payment.parent=init.name
            where payment.parenttype='Project Initiation' and init.name='{0}' and payment.scope_item='{1}'
            and payment.billing_percentage='{2}' and payment.total_billing_value='{3}' and payment.remaining_billing_value='{4}'
            """.format(self.project_name,item[0],item[3],item[14],item[15])) 
            if init_payment_name:
                init_payment_name=init_payment_name[0][0]

            doc = frappe.get_doc("Project Payment Schedule",init_payment_name)
            if doc.scope_item==item[0] and doc.billing_percentage==item[3] and doc.total_billing_value==item[14] and doc.remaining_billing_value==item[15]:
                doc.sales_invoice = sales_invoice
                doc.billing_status = 1
                doc.flags.ignore_mandatory = True
                doc.save(ignore_permissions=True)

        return init_payment_name





    # def updat_init_payment_table_sales_invoice(self,sales_invoice,scope_item,billing_percentage,total_billing_value,remaining_billing_value):
    #     init_payment_name = ''
    #     init_payment_name = frappe.db.sql("""
    #     select payment.name from `tabProject Payment Schedule` payment join `tabProject Initiation` init on payment.parent=init.name
    #     where payment.parenttype='Project Initiation' and init.name='{0}' and payment.scope_item='{1}'
    #     and payment.billing_percentage='{2}' and payment.total_billing_value='{3}' and payment.remaining_billing_value='{4}'
    #     """.format(self.project_name,scope_item,billing_percentage,total_billing_value,remaining_billing_value)) 
    #     if init_payment_name:
    #         init_payment_name=init_payment_name[0][0]

    #     doc = frappe.get_doc("Project Payment Schedule",init_payment_name)
    #     if doc.scope_item==scope_item and doc.billing_percentage==billing_percentage and doc.total_billing_value==total_billing_value and doc.remaining_billing_value==remaining_billing_value:
    #         doc.sales_invoice = sales_invoice
    #         doc.billing_status = 1
    #         doc.flags.ignore_mandatory = True
    #         doc.save(ignore_permissions=True)

    #     return init_payment_name





    def updat_init_payment_table_hybrid_invoice(self,items,sales_invoice,scope_item,billing_percentage,total_billing_value,remaining_billing_value):
        for item in items:
            init_payment_name = ''
            init_payment_name = frappe.db.sql("""
            select payment.name from `tabProject Payment Schedule` payment join `tabProject Initiation` init on payment.parent=init.name
            where payment.parenttype='Project Initiation' and init.name='{0}' and payment.scope_item='{1}'
            and payment.billing_percentage='{2}' and payment.total_billing_value='{3}' and payment.remaining_billing_value='{4}'
            """.format(self.project_name,item[0],item[3],item[14],item[15])) 
            if init_payment_name:
                init_payment_name=init_payment_name[0][0]

            doc = frappe.get_doc("Project Payment Schedule",init_payment_name)
            if doc.scope_item==item[0] and doc.billing_percentage==item[3] and doc.total_billing_value==item[14] and doc.remaining_billing_value==item[15]:
                doc.sales_invoice = sales_invoice
                doc.billing_status = 1
                doc.flags.ignore_mandatory = True
                doc.save(ignore_permissions=True)

        return init_payment_name





    def get_total_billing_so_far(self):
        total_project = 0
        total_project_count = 0
        total_item = 0
        for row in self.project_payment_schedule_control:
            if row.invoice==1:
                total_project = frappe.db.sql("""select sum(payment.total_billing_value) from `tabProject Payment Schedule` payment
                            join `tabProject Billing Control` billing on payment.parent=billing.name where payment.parenttype='Project Billing Control' 
                            and billing.project_name='{0}' and payment.invoice=1 """.format(self.project_name))
                
                total_project_count = frappe.db.sql("""select count(payment.total_billing_value) from `tabProject Payment Schedule` payment
                            join `tabProject Billing Control` billing on payment.parent=billing.name where payment.parenttype='Project Billing Control' 
                            and billing.project_name='{0}' and payment.invoice=1 """.format(self.project_name))
                

                total_item = frappe.db.sql("""select sum(payment.total_billing_value) from `tabProject Payment Schedule` payment
                            join `tabProject Billing Control` billing on payment.parent=billing.name where payment.parenttype='Project Billing Control' 
                            and billing.project_name='{0}' and payment.invoice=1 and payment.scope_item='{1}' """.format(self.project_name,row.scope_item))
            
        if total_project:
            total_project = total_project[0][0]
        else:
            total_project = 0

        if total_item:
            total_item = total_item[0][0]
        else:
            total_item = 0

        return total_project,total_item,total_project_count


