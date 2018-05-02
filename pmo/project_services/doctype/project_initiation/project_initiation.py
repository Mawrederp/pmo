# -*- coding: utf-8 -*-
# Copyright (c) 2018, s and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _
from frappe.model.document import Document

class ProjectInitiation(Document):
    def validate(self):
        self.validate_emp()
        if self.workflow_state:
            if "Rejected" in self.workflow_state:
                self.docstatus = 1
                self.docstatus = 2


    # def validate_emp(self):
    #     if self.get('__islocal'):
    #         if self.project_coordinator and self.project_manager:
    #             self.workflow_state = "Pending(PC+PM)"
    #         elif self.project_coordinator and self.senior_project_manager:
    #             self.workflow_state = "Pending(PC+SPM)"
    #         elif self.project_manager:
    #             self.workflow_state = "Pending(PM)"
    #         elif self.senior_project_manager:
    #             self.workflow_state = "Pending(SPM)"


    def validate_emp(self):
        if self.get('__islocal'):
            if self.project_coordinator:
                if self.project_manager:
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
            elif self.project_manager:
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




    def on_submit(self):
        frappe.get_doc({
            "doctype": "Project Planning",
            "project_name": self.project_name
        }).save(ignore_permissions = True)

        frappe.db.commit()

        pp = frappe.get_value("Project Planning", filters = {"project_name": self.project_name}, fieldname = "name")

        frappe.msgprint(_("""Project Planning have been created: <b><a href="#Form/Project Planning/{pp}">{pp}</a></b>""".format(pp = pp)))


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



@frappe.whitelist()
def get_project_detail(project, company=None):
    project_dict = frappe.db.sql("""select * from `tabProject Initiation` where name=%s""", (project), as_dict=1)
    if not project_dict:
        frappe.throw("Project {0} not found".format(project))

    project_financial_detail = frappe.db.sql(""" select * from `tabProject Financial Details` where parent=%s """, (project), as_dict=1)
    project_payment_schedule = frappe.db.sql(""" select * from `tabProject Payment Schedule` where parent=%s """, (project), as_dict=1)
    project_costing_schedule = frappe.db.sql(""" select * from `tabProject Costing Schedule` where parent=%s """, (project), as_dict=1)
    stakeholder = frappe.db.sql(""" select * from `tabStakeholder` where parent=%s """, (project), as_dict=1)
    project_major_deliverables = frappe.db.sql(""" select * from `tabProject Major Deliverables` where parent=%s """, (project), as_dict=1)
    project_high_level_risks = frappe.db.sql(""" select * from `tabProject Risk` where parent=%s """, (project), as_dict=1)
    vendor = frappe.db.sql(""" select * from `tabProject Vendor` where parent=%s """, (project), as_dict=1)


    details = project_dict[0]

    return details,project_financial_detail,project_payment_schedule,project_costing_schedule,stakeholder,project_major_deliverables,project_high_level_risks,vendor

