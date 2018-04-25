# -*- coding: utf-8 -*-
# Copyright (c) 2018, s and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class PMOResources(Document):
    def validate(self):
        for col in self.role_assignment:
            prefered_email = frappe.get_value("Employee", filters = {"user_id": col.user_id}, fieldname = "prefered_email")
            content_msg="You have owned a new role for project services"

            if col.project_coordinator == 1:
                if 'Project Coordinator' not in frappe.utils.user.get_roles(col.user_id):
                        frappe.utils.user.add_role(col.user_id,'Project Coordinator')

            if col.senior_project_manager == 1:
                if 'Senior Project Manager' not in frappe.utils.user.get_roles(col.user_id):
                        frappe.utils.user.add_role(col.user_id,'Senior Project Manager')

            if col.program_manager == 1:
                if 'Program Manager' not in frappe.utils.user.get_roles(col.user_id):
                        frappe.utils.user.add_role(col.user_id,'Program Manager')

            if col.pmo_director == 1:
                if 'PMO Director' not in frappe.utils.user.get_roles(col.user_id):
                        frappe.utils.user.add_role(col.user_id,'PMO Director')

            if col.project_manager == 1:
                if 'Project Manager' not in frappe.utils.user.get_roles(col.user_id):
                        frappe.utils.user.add_role(col.user_id,'Project Manager')

            if col.project_coordinator or col.senior_project_manager or col.program_manager or col.pmo_director or col.project_manager:
                if prefered_email:
                    try:
                        make(subject = "Assigne a new role", content=content_msg, recipients=prefered_email,
                            send_email=True, sender="erp@tawari.sa")
                    except:
                        frappe.msgprint("could not send")

    def onload(self):
        self.role_assignment = []
        users = frappe.db.sql("select distinct parent from `tabHas Role` where parenttype='User' and role in ('Project Coordinator','Program Manager','Project Manager','Senior Project Manager','PMO Director') and parent not in ('Administrator') ")
        if users:
            for i in range(len(users)):
                emp = frappe.db.sql("select name,user_id,designation from `tabEmployee` where user_id = '{0}'".format(users[i][0]))
                if emp:
                    self.append("role_assignment", {"employee": emp[0][0],"user_id": emp[0][1],"designation": emp[0][2]})


    def check_role(self, user_id):
        arr = []
        if 'Program Manager' in frappe.utils.user.get_roles(user_id):
            arr.append('Program Manager')
        if 'Project Coordinator' in frappe.utils.user.get_roles(user_id):
            arr.append('Project Coordinator')
        if 'Senior Project Manager' in frappe.utils.user.get_roles(user_id):
            arr.append('Senior Project Manager')
        if 'PMO Director' in frappe.utils.user.get_roles(user_id):
            arr.append('PMO Director')
        if 'Project Manager' in frappe.utils.user.get_roles(user_id):
            arr.append('Project Manager')
        return arr

