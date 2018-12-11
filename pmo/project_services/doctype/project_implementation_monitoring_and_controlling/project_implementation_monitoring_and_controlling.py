# -*- coding: utf-8 -*-
# Copyright (c) 2018, s and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _
from frappe.model.document import Document
import json

class ProjectImplementationMonitoringandControlling(Document):
    def validate(self):
        if self.workflow_state == 'Approved by PMO Director':
            if not frappe.db.exists("Project Closure", {"project_name": self.project_name}):
                self.make_project_closure()
                self.validate_emp()
    
        if self.workflow_state:
            if "Rejected" in self.workflow_state:
                self.docstatus = 1
                self.docstatus = 2

        # doc = frappe.db.sql("select data from `tabVersion` where ref_doctype='Project Implementation Monitoring and Controlling' and docname='{0}' order by creation desc limit 1".format(self.name))
        # if doc:
        #     for i in range(len(json.loads(doc[0][0])['changed'])):
        #         edit_property = json.loads(doc[0][0])['changed'][i][0]
        #         if edit_property=='workflow_state':
        #             pass
        #         else:
        #             self.cur_validate_emp()


    def cur_validate_emp(self):
        if self.project_coordinator:
            if self.project_manager_role:
                if self.senior_project_manager:
                    if self.program_manager:
                        self.workflow_state = "Pending(PC+ProjM+SPM+ProgM)"
                    else:
                        self.workflow_state = "Pending(PC+ProjM+SPM)"
                else:
                    if self.program_manager:
                        self.workflow_state = "Pending(PC+ProjM+ProgM)"
                    else:
                        self.workflow_state = "Pending(PC+ProjM)"
            else:
                if self.senior_project_manager:
                    if self.program_manager:
                        self.workflow_state = "Pending(PC+SPM+ProgM)"
                    else:
                        self.workflow_state = "Pending(PC+SPM)"
                else:
                    if self.program_manager:
                        self.workflow_state = "Pending(PC+ProgM)"
                    else:
                        self.workflow_state = "Pending(PC)"
        elif self.project_manager_role:
            if self.senior_project_manager:
                if self.program_manager:
                    self.workflow_state = "Pending(ProjM+SPM+ProgM)"
                else:
                    self.workflow_state = "Pending(ProjM+SPM)"
            else:
                if self.program_manager:
                    self.workflow_state = "Pending(ProjM+ProgM)"
                else:
                    self.workflow_state = "Pending(ProjM)"
        elif self.senior_project_manager:
            if self.program_manager:
                self.workflow_state = "Pending(SPM+ProgM)"
            else:
                self.workflow_state = "Pending(SPM)"
        elif self.program_manager:
            self.workflow_state = "Pending(ProgM)"


    def validate_emp(self):
        doc = frappe.get_doc("Project Closure", self.project_name)
        if doc:
            if self.project_coordinator:
                if self.project_manager_role:
                    if self.senior_project_manager:
                        if self.program_manager:
                            doc.workflow_state = "Pending(PC+ProjM+SPM+ProgM)"
                        else:
                            doc.workflow_state = "Pending(PC+ProjM+SPM)"
                    else:
                        if self.program_manager:
                            doc.workflow_state = "Pending(PC+ProjM+ProgM)"
                        else:
                            doc.workflow_state = "Pending(PC+ProjM)"
                else:
                    if self.senior_project_manager:
                        if self.program_manager:
                            doc.workflow_state = "Pending(PC+SPM+ProgM)"
                        else:
                            doc.workflow_state = "Pending(PC+SPM)"
                    else:
                        if self.program_manager:
                            doc.workflow_state = "Pending(PC+ProgM)"
                        else:
                            doc.workflow_state = "Pending(PC)"
            elif self.project_manager_role:
                if self.senior_project_manager:
                    if self.program_manager:
                        doc.workflow_state = "Pending(ProjM+SPM+ProgM)"
                    else:
                        doc.workflow_state = "Pending(ProjM+SPM)"
                else:
                    if self.program_manager:
                        doc.workflow_state = "Pending(ProjM+ProgM)"
                    else:
                        doc.workflow_state = "Pending(ProjM)"
            elif self.senior_project_manager:
                if self.program_manager:
                    doc.workflow_state = "Pending(SPM+ProgM)"
                else:
                    doc.workflow_state = "Pending(SPM)"
            elif self.program_manager:
                doc.workflow_state = "Pending(ProgM)"

            doc.program_manager = self.program_manager
            doc.senior_project_manager = self.senior_project_manager
            doc.project_manager_role = self.project_manager_role
            doc.project_coordinator = self.project_coordinator

            doc.save(ignore_permissions=True)

    def make_project_closure(self):
        doc_proj = frappe.get_doc("Project",self.project_name)

        doc_proj_initiation = frappe.get_doc("Project Initiation",self.project_name)
        
        doc_proj.state = "Implementation Monitoring and Controlling"
        doc_proj.save(ignore_permissions = True)
        frappe.db.commit()

        doc = frappe.get_doc({
            "doctype":"Project Closure",
            "project_name": self.project_name,
            "project": self.project_name,
            "projects_list": self.projects_list,
            "purchase_order_number": doc_proj_initiation.po_number,
            "purchase_order_date": doc_proj_initiation.po_date,
            "closure_tawari_name": doc_proj_initiation.project_manager_name,
            "closure_tawari_position": 'Project Manager'
            }).save(ignore_permissions = True)
        frappe.db.commit()
        
        cc = frappe.get_value("Project Closure", filters = {"project_name": self.project_name}, fieldname = "name")
        msg = """Project Closure has been created: <b><a href="#Form/Project Closure/{cc}">{cc}</a></b>""".format(cc=cc)
        frappe.msgprint(msg)
        

    def existing_project_initiation(self):
        project_name = frappe.get_value("Project Initiation", filters = {"project_name": self.project_name}, fieldname = "name")
        if project_name:
            return project_name
        else:
            frappe.throw("Project Initiation not exist for this project")


    def existing_project_planning(self):
        project_name = frappe.get_value("Project Planning", filters = {"project_name": self.project_name}, fieldname = "name")
        if project_name:
            return project_name
        else:
            frappe.throw("Project Planning not exist for this project")


    def existing_project_closure(self):
        project_name = frappe.get_value("Project Closure", filters = {"project_name": self.project_name}, fieldname = "name")
        if project_name:
            return project_name
        else:
            frappe.throw("Project Closure not exist for this project")


@frappe.whitelist()
def get_project_detail_controlling(project, company=None):
    project_dict = frappe.db.sql("""select * from `tabProject Implementation Monitoring and Controlling` where project_name=%s""", (project), as_dict=1)
    if not project_dict:
        frappe.throw("Project Implementation Monitoring and Controlling phase for project {0} not found".format(project))

    change_request = frappe.db.sql(""" select * from `tabControl Change Request` where parent=(select name from `tabProject Implementation Monitoring and Controlling` where project_name=%s) """, (project), as_dict=1)
    project_issues_sumary = frappe.db.sql(""" select * from `tabProject Issues Sumary` where parent=(select name from `tabProject Implementation Monitoring and Controlling` where project_name=%s) """, (project), as_dict=1)

    details = project_dict[0]

    return details,change_request,project_issues_sumary

