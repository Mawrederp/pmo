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
    # def validate(self):
    #     for row in self.project_payment_schedule_control:
    #         frappe.db.sql("update `tabProject Payment Schedule` set name='{0}' where name='{1}'".format(row.old_reference_name,row.name))


    def before_save(self):
        for row in self.project_payment_schedule_control:
            if row.date_period=='Date' and not row.when:
                frappe.throw("Mandatory field: When in table row {0}".format(row.idx))
            elif row.date_period=='Period' and not row.from_date:
                frappe.throw("Mandatory field: From Date in table row {0}".format(row.idx))
            elif row.date_period=='Period' and not row.to_date:
                frappe.throw("Mandatory field: To Date in table row {0}".format(row.idx))




    def make_project_sales_order_approval(self):
        sales_approval = frappe.db.sql("select name from `tabProject Sales Order Approval` where project_name='{0}' and docstatus=0".format(self.project_name))

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



    def make_delivery_note(self,items='',scope_item='',project_name='',items_value=0,billing_percentage=0,due_date='',description_when='',vat_value=0,billing_state=0,delivery_note='',schedule_bundle_qty_name='',is_advance=0):
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
        # item[14] = old_name

        if self.sales_order:
            arr=[]
            for row in self.project_payment_schedule_control:
                if row.invoice==1:
                    arr.append(row.name)

            if len(arr)==0:
                frappe.throw("Please check an item/s first")

            if delivery_note and billing_state==1:
                frappe.throw("You made Delivery Note for this item before")
            else:
                if arr :
                    if is_advance==0:
                        vat_account=''
                        item_name = frappe.get_value("Project Items", filters = {"name": scope_item}, fieldname = "item")

                        customer = frappe.db.sql("select customer from `tabProject Initiation` where name='{0}' ".format(self.project_name))

                        vat_account_field = frappe.db.sql("select account_head from `tabSales Taxes and Charges` where parent='Sales VAT'")
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
                                "taxes_and_charges": "Sales VAT"
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

                                        required_qty = frappe.db.sql("select qty from `tabProject Payment Schedule Bundle QTY` where parenttype='Project Billing Control' and parent='{0}' and parent_name='{1}' and item='{2}'".format(self.name,item[9],doc.items))
                                        if required_qty:
                                            if flt(required_qty[0][0]) == 0:
                                                required_qty = 1
                                        else:
                                            frappe.throw("Please click on <b>Refresh Table</b> button from <b><a href='#Form/Project Initiation/{0}'>{0}</a></b> under Project Payment Schedule to refresh items quantity".format(self.project_name))

                                        rate = doc.final_selling_price/flt(doc.quantity)

                                        dnote.append("items", {
                                            "item_code": doc.items,
                                            "description": description,
                                            "project_payment_schedule": item[13],
                                            "qty": flt(required_qty),
                                            "against_sales_order": self.sales_order,
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
                                                "against_sales_order": self.sales_order,
                                                "product_bundle": doc.items
                                            })
                                else:
                                    frappe.throw("This is Advance Payment, Please click Make Sales invoice instead")

                            for schedule_control in self.project_payment_schedule_control:
                                if schedule_control.invoice == 1:
                                    dnote.append("project_payment_schedule_delivery", {
                                        "scope_item": schedule_control.scope_item,
                                        "project_item_arabic": schedule_control.project_item_arabic,
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
        else:
            frappe.throw("Please make sales order first")



    def make_sales_invoice(self,items='',project_name='',scope_item='',items_value=0,billing_percentage=0,sales_invoice='',due_date='',description_when='',vat_value=0,billing_state=0,delivery_note='',schedule_bundle_qty_name='',is_advance=0,advanced_item='',billing_value=0,advance_amount=0):
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
        # item[18] = remaining_billing_percent
        # item[19] = old_name
        # item[20] = advance_amount

        if self.sales_order:
            arr=[]
            for row in self.project_payment_schedule_control:
                if row.invoice==1:
                    arr.append(row.name)

            if len(arr)==0:
                frappe.throw("Please check an item/s first")

            if sales_invoice and billing_state==1:
                frappe.throw("You made Sales Invoice for this item before")
            else:
                if arr :
                    vat_account=''
                    item_name = frappe.get_value("Project Items", filters = {"name": scope_item}, fieldname = "item")

                    customer = frappe.db.sql("select customer from `tabProject Initiation` where name='{0}' ".format(self.project_name))

                    vat_account_field = frappe.db.sql("select account_head from `tabSales Taxes and Charges` where parent='Sales VAT'")
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
                            "taxes_and_charges": "Sales VAT",
                            "item_advance_amount": advance_amount
                        })

                        for item in items:

                            resources_details_name = frappe.db.sql("select name from `tabItems Details` where parenttype='Project Initiation' and parent='{0}' and section_name='{1}' ".format(self.project_name,item[0]))

                            if item[10]==1:
                                if item[11]:
                                    frappe.throw("Sales invoice is already created")

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
                                    "sales_order": self.sales_order,
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
                                        "sales_order": self.sales_order,
                                        "product_bundle": doc.items
                                    })
                            else:

                                if item[10]!=1 and not item[8]:
                                    frappe.throw("You must make delivery note with item {0} before making sales invoice".format(item[0]))
                        
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
                                        "sales_order": self.sales_order,
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
                                            "sales_order": self.sales_order,
                                            "product_bundle": doc.items
                                        })

                        for schedule_control in self.project_payment_schedule_control:
                            if schedule_control.invoice == 1:
                                dnote.append("project_payment_schedule_invoice", {
                                    "scope_item": schedule_control.scope_item,
                                    "project_item_arabic": schedule_control.project_item_arabic,
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
        else:
            frappe.throw("Please make sales order first")





    def make_hybrid_invoice(self,items='',project_name='',scope_item='',items_value=0,billing_percentage=0,sales_invoice='',due_date='',description_when='',vat_value=0,billing_state=0,delivery_note='',schedule_bundle_qty_name='',is_advance=0,advanced_item='',billing_value=0):
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
        # item[18] = remaining_billing_percent
        # item[19] = old_name

        if self.sales_order:
            arr=[]
            for row in self.project_payment_schedule_control:
                if row.invoice==1:
                    arr.append(row.name)

            if len(arr)==0:
                frappe.throw("Please check an item/s first")

            if sales_invoice and billing_state==1:
                frappe.throw("You made Sales Invoice for this item before")
            else:
                if arr :
                    vat_account=''
                    item_name = frappe.get_value("Project Items", filters = {"name": scope_item}, fieldname = "item")

                    customer = frappe.db.sql("select customer from `tabProject Initiation` where name='{0}' ".format(self.project_name))

                    vat_account_field = frappe.db.sql("select account_head from `tabSales Taxes and Charges` where parent='Sales VAT'")
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
                            "taxes_and_charges": "Sales VAT"
                        })

                        for item in items:

                            resources_details_name = frappe.db.sql("select name from `tabItems Details` where parenttype='Project Initiation' and parent='{0}' and section_name='{1}' ".format(self.project_name,item[0]))

                            if item[10]==1:
                                if item[11]:
                                    frappe.throw("Sales invoice is already created")
                                    

                                required_qty = 1

                                dnote.append("items", {
                                    "item_code": item[12],
                                    "description": item[5],
                                    "project_payment_schedule": item[16],
                                    "qty": flt(flt(item[3])/100),
                                    "sales_order": self.sales_order,
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
                                        "sales_order": self.sales_order,
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
                                        "sales_order": self.sales_order,
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
                                            "sales_order": self.sales_order,
                                            "product_bundle": doc.items
                                        })

                        for schedule_control in self.project_payment_schedule_control:
                            if schedule_control.invoice == 1:
                                dnote.append("project_payment_schedule_invoice", {
                                    "scope_item": schedule_control.scope_item,
                                    "project_item_arabic": schedule_control.project_item_arabic,
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
        else:
            frappe.throw("Please make sales order first")




    def updat_init_payment_table_delivery_note(self,items,delivery_note,scope_item,billing_percentage,total_billing_value,remaining_billing_value):
        for item in items:

            doc_del = frappe.get_doc("Project Payment Schedule",str(item[14]))
            if doc_del:
                doc_del.delivery_note = delivery_note
                doc_del.billing_status = 1
                doc_del.flags.ignore_mandatory = True
                doc_del.save(ignore_permissions=True)







    def updat_init_payment_table_sales_invoice(self,items,sales_invoice,scope_item,billing_percentage,total_billing_value,remaining_billing_value):
        for item in items:

            docinv = frappe.get_doc("Project Payment Schedule",str(item[19]))
            if docinv:
                docinv.sales_invoice = sales_invoice
                docinv.billing_status = 1
                docinv.flags.ignore_mandatory = True
                docinv.save(ignore_permissions=True)








    def updat_init_payment_table_hybrid_invoice(self,items,sales_invoice,scope_item,billing_percentage,total_billing_value,remaining_billing_value):
        for item in items:

            doc_hy = frappe.get_doc("Project Payment Schedule",str(item[19]))
            if doc_hy:
                doc_hy.sales_invoice = sales_invoice
                doc_hy.billing_status = 1
                doc_hy.flags.ignore_mandatory = True
                doc_hy.save(ignore_permissions=True)




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




    def get_latest_item_update(self):
        cur_items = []
        new_items = []
        new_items_state= 0
        initiation_count = frappe.db.count("Project Payment Schedule", filters={'parent': self.project_name})
        billing_count = frappe.db.count("Project Payment Schedule", filters={'parent': self.name})

        for row in self.project_payment_schedule_control:
            cur_items.append(row.old_name)
            doc = frappe.get_doc("Project Payment Schedule",row.old_name)

            row.scope_item = doc.scope_item;
            row.from_date = doc.from_date;
            row.items_value = doc.items_value;
            row.billing_percentage = doc.billing_percentage;
            row.qty = doc.qty;
            row.number_of_invoices = doc.number_of_invoices;
            row.vat = doc.vat;
            row.vat_value = doc.vat_value;
            row.total_billing_value = doc.total_billing_value;
            row.remaining_billing_value = doc.remaining_billing_value;
            row.remaining_billing_percent = doc.remaining_billing_percent;
            row.date_period = doc.date_period;
            row.to_date = doc.to_date;
            row.billing_value = doc.billing_value;
            row.when = doc.when;
            row.description_when = doc.description_when;
            row.billing_status = doc.billing_status;
            row.is_advance = doc.is_advance;
            row.advanced_item = doc.advanced_item;
            row.advance_project_items = doc.advance_project_items;
            row.project_item_price = doc.project_item_price;
            row.advance_percent = doc.advance_percent;
            row.delivery_note = doc.delivery_note;
            row.sales_invoice = doc.sales_invoice;
            row.project_item_arabic = doc.project_item_arabic;
            row.old_name = doc.name;


        if initiation_count>billing_count:
            new_items_state= 1
            doc_init = frappe.get_doc("Project Initiation", self.project_name)
            for row_init in doc_init.project_payment_schedule:
                if row_init.name not in cur_items:
                    new_items.append(row_init.name)

            for new_item in new_items:
                doc = frappe.get_doc("Project Payment Schedule",new_item)
                self.append("project_payment_schedule_control", {
                      "scope_item": doc.scope_item,
                      "from_date": doc.from_date,
                      "items_value": doc.items_value,
                      "billing_percentage": doc.billing_percentage,
                      "qty": doc.qty,
                      "number_of_invoices": doc.number_of_invoices,
                      "vat": doc.vat,
                      "vat_value": doc.vat_value,
                      "total_billing_value": doc.total_billing_value,
                      "remaining_billing_value": doc.remaining_billing_value,
                      "remaining_billing_percent": doc.remaining_billing_percent,
                      "date_period": doc.date_period,
                      "to_date": doc.to_date,
                      "billing_value": doc.billing_value,
                      "when": doc.when,
                      "description_when": doc.description_when,
                      "billing_status": doc.billing_status,
                      "is_advance": doc.is_advance,
                      "advanced_item": doc.advanced_item,
                      "advance_project_items": doc.advance_project_items,
                      "project_item_price": doc.project_item_price,
                      "advance_percent": doc.advance_percent,
                      "delivery_note": doc.delivery_note,
                      "sales_invoice": doc.sales_invoice,
                      "project_item_arabic": doc.project_item_arabic,
                      "old_name": doc.name
                })

        return new_items_state,new_items

