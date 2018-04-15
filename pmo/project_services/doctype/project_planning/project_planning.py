# -*- coding: utf-8 -*-
# Copyright (c) 2018, s and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class ProjectPlanning(Document):
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


    def on_submit(self):
        doc = frappe.get_doc({
            "doctype":"Project Implementation Monitoring and Controlling",
            "project_name": self.project_name

        })
        doc.flags.ignore_mandatory = True
        doc.insert(ignore_permissions=True)

        doc_proj = frappe.get_doc("Project",self.project_name)
        doc_proj.state = "Planning"
        doc_proj.save(ignore_permissions = True)

        frappe.db.commit()

        msg = """Project Implementation Monitoring and Controlling has been created: <b><a href="#Form/Project Implementation Monitoring and Controlling/{0}">{0}</a></b>""".format(doc.name)
        frappe.msgprint(msg)



@frappe.whitelist()
def get_project_detail_planning(project, company=None):
    project_dict = frappe.db.sql("""select * from `tabProject Planning` where project_name=%s""", (project), as_dict=1)
    if not project_dict:
        frappe.throw("Project Planning phase for project {0} not found".format(project))

    risk_register = frappe.db.sql(""" select * from `tabRisk Register` where parent=(select name from `tabProject Planning` where project_name=%s) """, (project), as_dict=1)
    roles_and_responsibilities = frappe.db.sql(""" select * from `tabRoles And Responsibilities` where parent=(select name from `tabProject Planning` where project_name=%s) """, (project), as_dict=1)

    details = project_dict[0]

    return details,risk_register,roles_and_responsibilities

