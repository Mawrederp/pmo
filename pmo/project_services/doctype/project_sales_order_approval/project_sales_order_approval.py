# -*- coding: utf-8 -*-
# Copyright (c) 2018, s and contributors
# For license information, please see license.txt


from __future__ import unicode_literals
import frappe
from frappe import _
from frappe.model.document import Document
from frappe.utils import cint, cstr, date_diff, flt, formatdate, getdate, get_link_to_form, \
    comma_or, get_fullname
from frappe.model.mapper import get_mapped_doc
from frappe.contacts.doctype.address.address import get_company_address
from frappe.model.utils import get_fetch_values

class ProjectSalesOrderApproval(Document):
    def validate(self):
        if self.workflow_state:
            if "Rejected" in self.workflow_state:
                self.docstatus = 1
                self.docstatus = 2


    def make_sales_order(self):
        if self.sales_order:
            frappe.throw("You make Sales Order for this project before")
        else:
            doc = frappe.get_doc("Project Initiation", self.project_name)
            vat_account=''
            vat_account_field = frappe.db.sql("select account_head from `tabSales Taxes and Charges` where parent='Sales VAT'")
            if vat_account_field:
                vat_account = vat_account_field[0][0]
 

            if doc.customer:
                sinv=frappe.get_doc({
                    "doctype":"Sales Order",
                    "customer": doc.customer,
                    "customer_name": doc.customer,
                    "title": self.project_name,
                    "project": self.project_name,
                    "naming_series": 'SO-',
                    "delivery_date": doc.end_date,
                    # "items": [
                    #       {
                    #         "doctype": "Sales Order Item",
                    #         "item_code": item_name,
                    #         "description": description_when,
                    #         "qty": flt(flt(self.billing_percentage)/100),
                    #         "rate": self.items_value
                    #       }
                    #     ],

                    # "taxes": [
                    #       {
                    #         "doctype": "Sales Taxes and Charges",
                    #         "charge_type": 'Actual',
                    #         "description": description_when,
                    #         "tax_amount": self.vat_value
                    #       }
                    #     ],
                    "taxes_and_charges": "Sales VAT"
                })

                for row in self.project_payment_schedule_control:
                    resources_details_name = frappe.db.sql("select name from `tabItems Details` where parenttype='Project Initiation' and parent='{0}' and section_name='{1}' ".format(self.project_name,row.scope_item))
                    for resource in resources_details_name:

                        doc = frappe.get_doc("Items Details",resource[0])
                        # proj_item = frappe.get_doc("Project Items", doc.items)
                        item = frappe.get_doc("Item", doc.items)
                        description = item.description

                        rate = doc.final_selling_price
                        qty = 1
                        if flt(doc.quantity)>0:
                            rate = doc.final_selling_price/flt(doc.quantity)
                            qty = doc.quantity


                        sinv.append("items", {
                            "item_code": doc.items,
                            "description": description,
                            "qty": flt(qty)*flt(flt(row.billing_percentage)/100),
                            "rate": rate
                        })

                        sinv.append("taxes", {
                            "charge_type": 'Actual',
                            "account_head": vat_account,
                            "description": description,
                            "tax_amount": (doc.final_selling_price*0.05)*flt(flt(row.billing_percentage)/100)
                        })

                
                sinv.flags.ignore_mandatory = True
                sinv.insert(ignore_permissions=True)

                doc = frappe.get_doc("Project Initiation", self.project_name)
                if doc:
                    doc.sales_order = sinv.name
                    doc.flags.ignore_mandatory = True
                    doc.save(ignore_permissions=True)

                doc_billing_name = frappe.get_value("Project Billing Control", filters = {"project_name": self.project_name}, fieldname = "name")
                doc_billing = frappe.get_doc("Project Billing Control", doc_billing_name)
                if doc_billing:
                    doc_billing.sales_order = sinv.name
                    doc_billing.flags.ignore_mandatory = True
                    doc_billing.save(ignore_permissions=True)


                frappe.msgprint("Sales Order is created")
            else:
                frappe.throw('You sould select customer for this project before issue the sales order')
            

        return sinv.name
        


    # def updat_init_payment_table_invoice(self,sales_order):
    #     init_payment_name = ''
    #     init_payment_name = frappe.db.sql("""
    #     select payment.name from `tabProject Payment Schedule` payment join `tabProject Initiation` init on payment.parent=init.name
    #     where payment.parenttype='Project Initiation' and init.name='{0}' and payment.scope_item='{1}'
    #     and payment.billing_percentage='{2}' and payment.total_billing_value='{3}' and payment.remaining_billing_value='{4}'
    #     """.format(self.project_name,self.scope_item,self.billing_percentage,self.total_billing_value,self.remaining_billing_value)) 
    #     if init_payment_name:
    #         init_payment_name=init_payment_name[0][0]

    #     doc = frappe.get_doc("Project Payment Schedule",init_payment_name)
    #     if doc.scope_item==self.scope_item and doc.billing_percentage==self.billing_percentage and doc.total_billing_value==self.total_billing_value and doc.remaining_billing_value==self.remaining_billing_value:
    #         doc.sales_order = sales_order
    #         doc.billing_status = 1
    #         doc.flags.ignore_mandatory = True
    #         doc.save(ignore_permissions=True)

    #     return init_payment_name


@frappe.whitelist()
def make_delivery_note(source_name, target_doc=None):
    def set_missing_values(source, target):
        target.ignore_pricing_rule = 1
        # target.run_method("set_missing_values")
        # target.run_method("set_po_nos")
        # target.run_method("calculate_taxes_and_totals")
        target.items = []
        doc = frappe.new_doc("Delivery Note Item")
        doc.item_group = 'Project'
        doc.item_name = source.scope_item
        doc.qty = flt(flt(source.billing_percentage)/100)
        doc.rate = float(source.items_value)
        #doc.price_list_rate = float(source.items_value)
        doc.uom = "Nos"
        doc.is_stock_item = 0
        doc.description = source.description_when
        item_name = frappe.get_value("Item", filters = {"item_name": source.scope_item}, fieldname = "name")
        barcode = frappe.get_value("Item", filters = {"item_name": source.scope_item}, fieldname = "barcode")
        doc.item_code = item_name
        doc.warehouse = "Stores - T"
        doc.barcode = barcode
        #doc.base_amount = (flt(flt(source.billing_percentage)/100) * float(source.items_value))
        #doc.amount = (flt(flt(source.billing_percentage)/100) * float(source.items_value))
        target.items.append(doc)

        target.project = source.project_name
        target.project_sales_order_approval = source.name

        
        # set company address
        target.update(get_company_address(target.company))
        if target.company_address:
            target.update(get_fetch_values("Delivery Note", 'company_address', target.company_address))

    def update_item(source, target, source_parent):
        target.base_amount = (flt(source.qty) - flt(source.delivered_qty)) * flt(source.base_rate)
        target.amount = (flt(source.qty) - flt(source.delivered_qty)) * flt(source.rate)
        target.qty = flt(source.qty) - flt(source.delivered_qty)
        
        item = None
        item_group = None

        if item:
            target.cost_center = frappe.db.get_value("Project", source_parent.project, "cost_center") \
                or item.get("selling_cost_center") \
                or item_group.get("selling_cost_center")

    target_doc = get_mapped_doc("Project Sales Order Approval", source_name, {
        "Project Sales Order Approval": {
            "doctype": "Delivery Note",
            "validation": {
                "workflow_state": ["=", "Approved by PMO Director"]
            }
        }
    }, target_doc, set_missing_values)

    return target_doc