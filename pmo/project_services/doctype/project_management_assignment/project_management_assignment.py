# -*- coding: utf-8 -*-
# Copyright (c) 2018, s and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class ProjectManagementAssignment(Document):
    def validate(self):
        doc = frappe.get_doc("Create Project", self.project_name)
        doc_initiation = frappe.get_doc("Project Initiation", self.project_name)
        if doc and doc_initiation:
            doc.project_coordinator = self.project_coordinator
            doc.project_manager = self.project_manager
            doc.senior_project_manager = self.senior_project_manager
            doc.save()

            doc_initiation.project_coordinator = self.project_coordinator
            doc_initiation.project_manager_role = self.project_manager
            doc_initiation.senior_project_manager = self.senior_project_manager
            doc_initiation.save()
            
            frappe.msgprint("Success Assigned to Project : "+self.project_name)

    def before_save(self):
        frappe.db.sql("delete from `tabUser Permission` where for_value ='{0}'".format(self.project_name))
        if self.project_coordinator:
            frappe.get_doc({
                "doctype":"User Permission",
                "user": self.project_coordinator,
                "allow": "Project",
                "for_value": self.project_name,
                "apply_for_all_roles": 0
            }).insert(ignore_permissions=True)

        if self.project_manager:
            frappe.get_doc({
                "doctype":"User Permission",
                "user": self.project_manager,
                "allow": "Project",
                "for_value": self.project_name,
                "apply_for_all_roles": 0
            }).insert(ignore_permissions=True)

        if self.senior_project_manager:
            frappe.get_doc({
                "doctype":"User Permission",
                "user": self.senior_project_manager,
                "allow": "Project",
                "for_value": self.project_name,
                "apply_for_all_roles": 0
            }).insert(ignore_permissions=True)



    # def before_save(self):
    # frappe.throw(self.project_coordinator)
    # if frappe.db.exists("User Permission", {"for_value": self.project_name}):
    #     if frappe.db.exists("User Permission", {"for_value": self.project_name, "user": self.project_coordinator}):
    #         if self.project_coordinator:
    #             user_permission = frappe.get_value("User Permission", filters={"for_value": self.project_name, "user": self.project_coordinator}, fieldname="name")
    #             doc = frappe.get_doc("User Permission", user_permission)
    #             doc.user = self.project_coordinator
    #             doc.save()
    #     if frappe.db.exists("User Permission", {"for_value": self.project_name, "user": self.project_manager}):
    #         if self.project_manager:
    #             user_permission = frappe.get_value("User Permission", filters={"for_value": self.project_name, "user": self.project_manager}, fieldname="name")
    #             doc = frappe.get_doc("User Permission", user_permission)
    #             doc.user = self.project_manager
    #             doc.save()
    #     if frappe.db.exists("User Permission", {"for_value": self.project_name, "user": self.senior_project_manager}):
    #         if self.senior_project_manager:
    #             user_permission = frappe.get_value("User Permission", filters={"for_value": self.project_name, "user": self.senior_project_manager}, fieldname="name")
    #             doc = frappe.get_doc("User Permission", user_permission)
    #             doc.user = self.senior_project_manager
    #             doc.save()
    # else:
    #     if self.project_coordinator:
    #         frappe.get_doc({
    #             "doctype":"User Permission",
    #             "user": self.project_coordinator,
    #             "allow": "Project",
    #             "for_value": self.project_name,
    #             "apply_for_all_roles": 0
    #         }).insert(ignore_permissions=True)

    #     if self.project_manager:
    #         frappe.get_doc({
    #             "doctype":"User Permission",
    #             "user": self.project_manager,
    #             "allow": "Project",
    #             "for_value": self.project_name,
    #             "apply_for_all_roles": 0
    #         }).insert(ignore_permissions=True)

    #     if self.senior_project_manager:
    #         frappe.get_doc({
    #             "doctype":"User Permission",
    #             "user": self.senior_project_manager,
    #             "allow": "Project",
    #             "for_value": self.project_name,
    #             "apply_for_all_roles": 0
    #         }).insert(ignore_permissions=True)


    def get_wf_assignment(self):
        doc = frappe.get_doc("Create Project", self.project_name)
        if doc and (doc.project_coordinator or doc.project_manager or doc.senior_project_manager):
            return doc.project_coordinator,doc.project_manager,doc.senior_project_manager            
        else:
            pass


def get_projects_users(doctype, txt, searchfield, start, page_len, filters):
    return frappe.db.sql(""" select distinct parent from `tabHas Role` where parenttype='User' and role in ('Project Coordinator','Program Manager','Project Manager','Senior Project Manager','PMO Director') and parent not in ('Administrator') """)

    