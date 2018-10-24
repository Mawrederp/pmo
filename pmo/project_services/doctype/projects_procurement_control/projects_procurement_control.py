# -*- coding: utf-8 -*-
# Copyright (c) 2018, s and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from frappe.utils import cint, cstr, date_diff, flt, formatdate, getdate, get_link_to_form, \
    comma_or, get_fullname
from frappe import utils

class ProjectsProcurementControl(Document):
    def before_save(self):
        for row in self.project_costing_schedule_control:
            if not row.last_date:
                frappe.throw("Mandatory field: Last Date in table row {0}".format(row.idx))

            if not row.scope_item:
                frappe.throw("Mandatory field: Scope Item in table row {0}".format(row.idx))
    

    def make_material_request(self,scope_item,description_comments,last_date,material_request,cost_status,po_contract_extimated_cost):
        arr=[]
        for row in self.project_costing_schedule_control:
            if row.pr==1:
                arr.append(row.name)

        # status = 1
        # for row in self.project_costing_schedule_control:
        #     doc = frappe.get_doc("Project Items", row.scope_item)
        #     if doc.status != 'Active':
        #         frappe.msgprint("Project Item {0} in row {1} doesnt link to Items,please check: <b><a href='#Form/Project Items/{0}'>{0}</a></b>".format(row.scope_item,row.idx))
        #         status = 0

        material_request_name = ''
        # if status==1:
           

        if cost_status==1:
            frappe.throw("You made Material Request for this item before!")
        else:
            if arr and len(arr)==1:

                item_name = frappe.get_value("Item", filters = {"item_name": scope_item}, fieldname = "name")    

                resources_details_name = frappe.db.sql("select name from `tabItems Details` where parenttype='Project Initiation' and parent='{0}' and section_name='{1}' ".format(self.project_name,scope_item))

                mreq=frappe.get_doc({
                    "doctype":"Material Request",
                    "naming_series": 'MREQ-',
                    "workflow_state": 'Created By Project Manager',
                    "material_request_type": 'Purchase',
                    # "schedule_date": last_date,
                    "purchase_workflow": 'Project',
                    "project": self.project_name,
                    "suggested_grand_total": po_contract_extimated_cost,
                    "material_requester": "EMP/1005"
                    
                    # "items": [
                    #     {
                    #       "doctype": "Material Request Item",
                    #       "item_code": project_item.item,
                    #       "description": description,
                    #       "qty": 1
                    #     }
                    #   ]
                })


                for resource in resources_details_name:
                        
                    doc = frappe.get_doc("Items Details",resource[0])
                    # proj_item = frappe.get_doc("Project Items", doc.items)
                    item = frappe.get_doc("Item", doc.items)

                    description=item.description

                    qty = 1
                    if flt(doc.quantity)>0:
                        qty = doc.quantity


                    mreq.append("items", {
                        "item_code": doc.items,
                        "description": description,
                        "qty": qty
                    })

                    mreq.main_project_procurement = doc.section_name
                   
                    product_bundle = frappe.db.sql("""select t1.item_code, t1.qty, t1.uom, t1.description
                        from `tabProduct Bundle Item` t1, `tabProduct Bundle` t2
                        where t2.new_item_code=%s and t1.parent = t2.name order by t1.idx""", doc.items, as_dict=1)

                    if product_bundle:
                        for bundle in product_bundle:
                            item_bundle = frappe.get_doc("Item", bundle.item_code)

                            mreq.append("items", {
                                "item_code": bundle.item_code,
                                "item_name": bundle.item_name,
                                "description": bundle.description,
                                "qty": flt(bundle.qty)*flt(qty),
                                "warehouse": item_bundle.default_warehouse,
                                "schedule_date": frappe.utils.get_last_day(utils.today()),
                                "is_product_bundle_item": 1 ,
                                "product_bundle": doc.items
                            })



                # mreq.flags.ignore_validate = True
                mreq.flags.ignore_mandatory = True
                mreq.insert(ignore_permissions=True)


                frappe.msgprint("Material Request is created")
                
            else:
                frappe.throw("You should check one PR to make Material Request, or this item may have already Material Request")

        material_request_name = mreq.name
        return material_request_name





    def updat_material_costing_table(self,material_request,itm,idx,scope_item_cost_value,po_contract_extimated_cost):
        material_costing_name = ''
        material_costing_name = frappe.db.sql("""
        select costing.name from `tabProject Costing Schedule` costing join `tabProject Initiation` init on costing.parent=init.name
        where costing.parenttype='Project Initiation' and init.name='{0}' and costing.scope_item='{1}'
        and costing.scope_item_cost_value='{2}' and costing.po_contract_extimated_cost='{3}'
        """.format(self.project_name,itm,scope_item_cost_value,po_contract_extimated_cost)) 
        if material_costing_name:
            material_costing_name=material_costing_name[0][0]
        
        doc = frappe.get_doc("Project Costing Schedule",material_costing_name)
        if doc.scope_item == itm and doc.scope_item_cost_value == scope_item_cost_value and doc.po_contract_extimated_cost == po_contract_extimated_cost:
            doc.material_request = material_request
            doc.cost_status = 1
            doc.flags.ignore_mandatory = True
            doc.save(ignore_permissions=True)

        return material_costing_name

        
