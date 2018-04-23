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


    def get_wf_assignment(self):
        doc = frappe.get_doc("Create Project", self.project_name)
        if doc and (doc.project_coordinator or doc.project_manager or doc.senior_project_manager):
            return doc.project_coordinator,doc.project_manager,doc.senior_project_manager            
        else:
            pass




def get_projects_users(doctype, txt, searchfield, start, page_len, filters):
    return frappe.db.sql(""" select distinct parent from `tabHas Role` where parenttype='User' and role in ('Project Coordinator','Program Manager','Project Manager','Senior Project Manager','PMO Director') and parent not in ('Administrator') """)

    