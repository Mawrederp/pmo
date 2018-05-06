# -*- coding: utf-8 -*-
# Copyright (c) 2018, s and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class PMOResources(Document):
    def validate(self):
        from frappe.core.doctype.communication.email import make
        prefered_email = frappe.get_value("Employee", filters = {"user_id": self.user_id}, fieldname = "prefered_email")
        content_msg="You have owned a new role for project services"

        # frappe.db.sql("delete from `tabHas Role` where parent='{0}' and role in ('Project Coordinator','Senior Project Manager','Program Manager','PMO Director','Project Manager')".format(self.user_id))

        if self.project_coordinator == 1:
            if 'Project Coordinator' not in frappe.utils.user.get_roles(self.user_id):
                    frappe.utils.user.add_role(self.user_id,'Project Coordinator')

        if self.senior_project_manager == 1:
            if 'Senior Project Manager' not in frappe.utils.user.get_roles(self.user_id):
                    frappe.utils.user.add_role(self.user_id,'Senior Project Manager')

        if self.program_manager == 1:
            if 'Program Manager' not in frappe.utils.user.get_roles(self.user_id):
                    frappe.utils.user.add_role(self.user_id,'Program Manager')

        if self.pmo_director == 1:
            if 'PMO Director' not in frappe.utils.user.get_roles(self.user_id):
                    frappe.utils.user.add_role(self.user_id,'PMO Director')

        if self.project_manager == 1:
            if 'Project Manager' not in frappe.utils.user.get_roles(self.user_id):
                    frappe.utils.user.add_role(self.user_id,'Project Manager')

        if self.project_coordinator or self.senior_project_manager or self.program_manager or self.pmo_director or self.project_manager:
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
                roles=''
                emp = frappe.db.sql("select name,user_id,designation,employee_name from `tabEmployee` where user_id = '{0}'".format(users[i][0]))
                if 'Project Coordinator' in frappe.utils.user.get_roles(users[i][0]):
                    roles += 'Project Coordinator'+"\n"
                if 'Senior Project Manager' in frappe.utils.user.get_roles(users[i][0]):
                    roles += 'Senior Project Manager'+"\n"
                if 'Program Manager' in frappe.utils.user.get_roles(users[i][0]):
                    roles += 'Program Manager'+"\n"
                if 'PMO Director' in frappe.utils.user.get_roles(users[i][0]):
                    roles += 'PMO Director'+"\n"
                if 'Project Manager' in frappe.utils.user.get_roles(users[i][0]):
                    roles += 'Project Manager'+"\n"

                if emp:
                    self.append("role_assignment", {"employee": emp[0][0],"user_id": emp[0][1],"designation": emp[0][2],"employee_name": emp[0][3],"roles": roles})


        

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

