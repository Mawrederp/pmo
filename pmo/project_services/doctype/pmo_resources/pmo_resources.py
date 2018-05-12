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
        content_msg="You are now part of the ERP PMO, Please use your access credentials to access the ERP PMO system."

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

        if self.project_manager == 1:
            if 'Project Manager' not in frappe.utils.user.get_roles(self.user_id):
                    frappe.utils.user.add_role(self.user_id,'Project Manager')

        if self.project_coordinator or self.senior_project_manager or self.program_manager or self.project_manager:
            if prefered_email:
                try:
                    make(subject = "ERP PMO Action Required", content=content_msg, recipients=prefered_email,
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

        

        # pmo_resources = frappe.db.sql("select project_name,program_manager,senior_project_manager,project_manager,project_coordinator from `tabProject Management Assignment` where docstatus=1")
        # proj = []
        # for i in pmo_resources:
        #     if i[1]:
        #         for x in self.role_assignment:
        #             if i[1] == x.user_id:
        #                 proj.append(i[0])
        #             if i[2] == x.user_id:
        #                 proj.append(i[0])
        #             if i[3] == x.user_id:
        #                 proj.append(i[0])
        #             if i[4] == x.user_id:
        #                 proj.append(i[0])

        #             for proj_name in range(len(proj)):
        #                 if proj[proj_name] not in str(x.assigned_project):
        #                     x.assigned_project = proj[proj_name]+"\n"
        #                     print '*****************************'
        #                     print proj[proj_name]
        #                     print '*****************************'
            

        #     # if i[2]:
        #     #     proj = ''
        #     #     for x in self.role_assignment:
        #     #         if i[2] == x.user_id:
        #     #             proj =  i[0]
        #     #         x.assigned_project = proj
        #     #     print '*****************************'
        #     #     print proj
        #     #     print '*****************************'

        #     # if i[3]:
        #     #     for x in self.role_assignment:
        #     #         if i[3] == x.user_id:
        #     #             x.assigned_project = i[0]+"\n"
        #     # if i[4]:
        #     #     for x in self.role_assignment:
        #     #         if i[4] == x.user_id:
        #     #             x.assigned_project = i[0]+"\n"


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


    # def check_assigned_project(self):
    #     pmo_resources = frappe.db.sql("select project_name,program_manager,senior_project_manager,project_manager,project_coordinator from `tabProject Management Assignment` where docstatus=1")
    #     program_manager = []
    #     senior_project_manager = []
    #     project_manager = []
    #     project_coordinator = []

    #     for i in pmo_resources:
    #         if i[1]:
    #             program_manager.append(i[0])
    #     for i in pmo_resources:
    #         if i[2]:
    #             senior_project_manager.append(i[0])
    #     for i in pmo_resources:
    #         if i[3]:
    #             project_manager.append(i[0])
    #     for i in pmo_resources:
    #         if i[4]:
    #             project_coordinator.append(i[0])

    #     return program_manager,senior_project_manager,project_manager,project_coordinator
    #     

