# -*- coding: utf-8 -*-
# Copyright (c) 2018, s and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document


class ProjectClosure(Document):
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

