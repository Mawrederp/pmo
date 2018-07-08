# -*- coding: utf-8 -*-
# Copyright (c) 2018, s and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _
from frappe.model.document import Document
import json

class ProjectClosure(Document):
    def validate(self):
        if self.workflow_state:
            if "Rejected" in self.workflow_state:
                self.docstatus = 1
                self.docstatus = 2

        doc = frappe.db.sql("select data from `tabVersion` where ref_doctype='Project Closure' and docname='{0}' order by creation desc limit 1".format(self.name))
        for i in range(len(json.loads(doc[0][0])['changed'])):
            edit_property = json.loads(doc[0][0])['changed'][i][0]
            if edit_property=='workflow_state':
                pass
            else:
                self.cur_validate_emp()


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


    def on_submit(self):
        doc = frappe.get_doc("Project", self.project_name)
        doc.state = "Closed"
        doc.status = "Completed"
        doc.save(ignore_permissions=True)

        frappe.db.commit()


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


    def existing_project_controlling(self):
        project_name = frappe.get_value("Project Implementation Monitoring and Controlling", filters = {"project_name": self.project_name}, fieldname = "name")
        if project_name:
            return project_name
        else:
            frappe.throw("Project Implementation Monitoring and Controlling not exist for this project")



@frappe.whitelist()
def get_project_detail_closure(project, company=None):
    project_dict = frappe.db.sql("""select * from `tabProject Closure` where project_name=%s""", (project), as_dict=1)
    if not project_dict:
        frappe.throw("Project Closure phase for project {0} not found".format(project))

    details = project_dict[0]

    return details

