# -*- coding: utf-8 -*-
# Copyright (c) 2018, s and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _
from frappe.model.document import Document
import json

class ProjectPlanning(Document):
    def validate(self):
        if self.workflow_state == 'Approved by PMO Director':
            self.make_project_controlling()
            self.validate_emp()
    
        if self.workflow_state:
            if "Rejected" in self.workflow_state:
                self.docstatus = 1
                self.docstatus = 2

        doc = frappe.db.sql("select data from `tabVersion` where ref_doctype='Project Planning' and docname='{0}' order by creation desc limit 1".format(self.name))
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



    def validate_emp(self):
        doc = frappe.get_doc("Project Implementation Monitoring and Controlling", self.project_name)
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


    def onload(self):
        roles_and_responsibilities = frappe.db.sql("select name1,party,project_role from `tabRoles And Responsibilities` where parent='{0}'".format(self.name))
        
        self.client_steering_name = ''
        self.client_ownership_name = ''
        self.client_management_name = ''
        self.client_technical_name = ''
        self.tawari_steering_name = ''
        self.tawari_ownership_name = ''
        self.tawari_management_name = ''
        self.tawari_technical_name = ''
        self.partner_steering_name = ''
        self.partner_ownership_name = ''
        self.partner_management_name = ''
        self.partner_technical_name = ''
                
        for row in roles_and_responsibilities:
            if row:
                if row[1] == 'Client':
                    if row[2] == 'Steering Committee':
                        self.client_steering_name = row[0]
                    if row[2] == 'Ownership level':
                        self.client_ownership_name = row[0]
                    if row[2] == 'Project Management':
                        self.client_management_name = row[0]
                    if row[2] == 'Technical management':
                        self.client_technical_name = row[0]
                if row[1] == 'Tawari':
                    if row[2] == 'Steering Committee':
                        self.tawari_steering_name = row[0]
                    if row[2] == 'Ownership level':
                        self.tawari_ownership_name = row[0]
                    if row[2] == 'Project Management':
                        self.tawari_management_name = row[0]
                    if row[2] == 'Technical management':
                        self.tawari_technical_name = row[0]
                if row[1] == 'Partner/Supplier':
                    if row[2] == 'Steering Committee':
                        self.partner_steering_name = row[0]
                    if row[2] == 'Ownership level':
                        self.partner_ownership_name = row[0]
                    if row[2] == 'Project Management':
                        self.partner_management_name = row[0]
                    if row[2] == 'Technical management':
                        self.partner_technical_name = row[0]


    def make_project_controlling(self):
        doc = frappe.get_doc({
            "doctype":"Project Implementation Monitoring and Controlling",
            "project_name": self.project_name,
            "project": self.project_name,
            "projects_list": self.projects_list
        })
        doc.flags.ignore_mandatory = True
        doc.insert(ignore_permissions=True)

        doc_proj = frappe.get_doc("Project",self.project_name)
        doc_proj.state = "Planning"
        doc_proj.save(ignore_permissions = True)

        frappe.db.commit()

        msg = """Project Implementation Monitoring and Controlling has been created: <b><a href="#Form/Project Implementation Monitoring and Controlling/{0}">{0}</a></b>""".format(doc.name)
        frappe.msgprint(msg)



    def existing_project_initiation(self):
        project_name = frappe.get_value("Project Initiation", filters = {"project_name": self.project_name}, fieldname = "name")
        if project_name:
            return project_name
        else:
            frappe.throw("Project Initiation not exist for this project")


    def existing_project_controlling(self):
        project_name = frappe.get_value("Project Implementation Monitoring and Controlling", filters = {"project_name": self.project_name}, fieldname = "name")
        if project_name:
            return project_name
        else:
            frappe.throw("Project Implementation Monitoring and Controlling not exist for this project")


    def existing_project_closure(self):
        project_name = frappe.get_value("Project Closure", filters = {"project_name": self.project_name}, fieldname = "name")
        if project_name:
            return project_name
        else:
            frappe.throw("Project Closure not exist for this project")



@frappe.whitelist()
def get_project_detail_planning(project, company=None):
    project_dict = frappe.db.sql("""select * from `tabProject Planning` where project_name=%s""", (project), as_dict=1)
    if not project_dict:
        frappe.throw("Project Planning phase for project {0} not found".format(project))

    risk_register = frappe.db.sql(""" select * from `tabRisk Register` where parent=(select name from `tabProject Planning` where project_name=%s) """, (project), as_dict=1)
    roles_and_responsibilities = frappe.db.sql(""" select * from `tabRoles And Responsibilities` where parent=(select name from `tabProject Planning` where project_name=%s) """, (project), as_dict=1)

    details = project_dict[0]

    return details,risk_register,roles_and_responsibilities

