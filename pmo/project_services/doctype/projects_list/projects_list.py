# -*- coding: utf-8 -*-
# Copyright (c) 2018, s and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _
from frappe.model.document import Document

class ProjectsList(Document):
    # def validate(self):
    #     if self.is_new() and frappe.db.exists("Project", {"project": self.project_name}):
    #         frappe.throw('This project name is already exist, please choose another project name')
            

    def on_submit(self):
        frappe.get_doc({
            "doctype": "Project",
            "project_name": self.project_name,
            "projects_list": self.name
        }).save(ignore_permissions = True)
        frappe.db.commit()

        frappe.get_doc({
            "doctype": "Project Initiation",
            "project_name": self.project_name,
            "project": self.project_name,
            "projects_list": self.name
        }).save(ignore_permissions = True)
        frappe.db.commit()
        self.project_initiation = self.project_name

        frappe.msgprint(_("""Project {project} has been created""".format(project=self.project_name)))


    def on_trash(self):
        if frappe.db.exists("Project Initiation", {"project": self.project_name}):
            frappe.throw("You cannot delete this project list because its link with Project Initiation phase")


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


    def existing_project_closure(self):
        project_name = frappe.get_value("Project Closure", filters = {"project_name": self.project_name}, fieldname = "name")
        if project_name:
            return project_name
        else:
            frappe.throw("Project Closure not exist for this project")