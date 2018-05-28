# -*- coding: utf-8 -*-
# Copyright (c) 2018, s and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class ProjectManagementAssignment(Document):
    def on_submit(self):
        from frappe.core.doctype.communication.email import make
        prefered_email_program_manager = frappe.get_value("Employee", filters = {"user_id": self.program_manager}, fieldname = "prefered_email")
        prefered_email_senior_project_manager = frappe.get_value("Employee", filters = {"user_id": self.senior_project_manager}, fieldname = "prefered_email")
        prefered_email_project_manager = frappe.get_value("Employee", filters = {"user_id": self.project_manager}, fieldname = "prefered_email")
        prefered_email_project_coordinator = frappe.get_value("Employee", filters = {"user_id": self.project_coordinator}, fieldname = "prefered_email")

        content_msg="You are now part of the {0} roject, please use your access credentials to login into the system and work on the project.".format(self.project_name)

        doc = frappe.get_doc("Projects List", self.project_name)
        doc_initiation = frappe.get_doc("Project Initiation", self.project_name)
        if doc and doc_initiation:
            
            doc.project_coordinator = self.project_coordinator
            doc.project_manager = self.project_manager
            doc.senior_project_manager = self.senior_project_manager
            doc.program_manager = self.program_manager
            doc.save(ignore_permissions=True)

            doc_initiation.project_coordinator = self.project_coordinator
            doc_initiation.project_manager_role = self.project_manager
            doc_initiation.senior_project_manager = self.senior_project_manager
            doc_initiation.program_manager = self.program_manager
            doc_initiation.save(ignore_permissions=True)
            
            frappe.msgprint("Success Assigned to Project : "+self.project_name)

            if self.program_manager and prefered_email_program_manager:
                try:
                    make(subject = "ERP PMO Action Required", content=content_msg, recipients=prefered_email_program_manager,
                        send_email=True, sender="erp@tawari.sa")
                except:
                    frappe.msgprint("could not send")

            if self.senior_project_manager and prefered_email_senior_project_manager:
                try:
                    make(subject = "ERP PMO Action Required", content=content_msg, recipients=prefered_email_senior_project_manager,
                        send_email=True, sender="erp@tawari.sa")
                except:
                    frappe.msgprint("could not send")

            if self.project_manager and prefered_email_project_manager:
                try:
                    make(subject = "ERP PMO Action Required", content=content_msg, recipients=prefered_email_project_manager,
                        send_email=True, sender="erp@tawari.sa")
                except:
                    frappe.msgprint("could not send")

            if self.project_coordinator and prefered_email_project_coordinator:
                try:
                    make(subject = "ERP PMO Action Required", content=content_msg, recipients=prefered_email_project_coordinator,
                        send_email=True, sender="erp@tawari.sa")
                except:
                    frappe.msgprint("could not send")

            self.validate_emp()


    # def validate_emp(self):
    #     doc = frappe.get_doc("Project Initiation", self.project_name)
    #     if doc:
    #         if self.project_coordinator and self.project_manager:
    #             doc.workflow_state = "Pending(PC+PM)"
    #         elif self.project_coordinator and self.senior_project_manager:
    #             doc.workflow_state = "Pending(PC+SPM)"
    #         elif self.project_manager:
    #             doc.workflow_state = "Pending(PM)"
    #         elif self.senior_project_manager:
    #             doc.workflow_state = "Pending(SPM)"
    #         doc.save(ignore_permissions=True)

    def validate_emp(self):
        doc = frappe.get_doc("Project Initiation", self.project_name)
        if doc:
            if self.project_coordinator:
                if self.project_manager:
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
            elif self.project_manager:
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

            doc.save(ignore_permissions=True)




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

        if self.program_manager:
            frappe.get_doc({
                "doctype":"User Permission",
                "user": self.program_manager,
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
        doc = frappe.get_doc("Projects List", self.project_name)
        if doc and (doc.project_coordinator or doc.project_manager or doc.senior_project_manager or doc.program_manager):
            return doc.project_coordinator,doc.project_manager,doc.senior_project_manager,doc.program_manager
        else:
            pass


def get_project_coordinator(doctype, txt, searchfield, start, page_len, filters):
    return frappe.db.sql(""" select distinct parent from `tabHas Role` where parenttype='User' and role in ('Project Coordinator') and parent not in ('Administrator') """)

def get_project_manager(doctype, txt, searchfield, start, page_len, filters):
    return frappe.db.sql(""" select distinct parent from `tabHas Role` where parenttype='User' and role in ('Project Manager') and parent not in ('Administrator') """)

def get_senior_project_manager(doctype, txt, searchfield, start, page_len, filters):
    return frappe.db.sql(""" select distinct parent from `tabHas Role` where parenttype='User' and role in ('Senior Project Manager') and parent not in ('Administrator') """)

def get_program_manager(doctype, txt, searchfield, start, page_len, filters):
    return frappe.db.sql(""" select distinct parent from `tabHas Role` where parenttype='User' and role in ('Program Manager') and parent not in ('Administrator') """)

