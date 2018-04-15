# -*- coding: utf-8 -*-
# Copyright (c) 2018, s and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class ProjectImplementationMonitoringandControlling(Document):
    def on_submit(self):

        # doc.flags.ignore_mandatory = True
        # doc.insert(ignore_permissions=True)
        doc_proj = frappe.get_doc("Project",self.project_name)
        doc_proj.state = "Implementation Monitoring and Controlling"
        doc_proj.save(ignore_permissions = True)
        frappe.db.commit()

        # pp = frappe.get_doc({
        #     "doctype":"Project Planning",
        #     "project_name": self.project_name
        #     }).save(ignore_permissions = True)
        # frappe.db.commit()

        doc = frappe.get_doc({
            "doctype":"Project Closure",
            "project_name": self.project_name
            }).save(ignore_permissions = True)
        frappe.db.commit()
        
        cc = frappe.get_value("Project Closure", filters = {"project_name": self.project_name}, fieldname = "name")
        msg = """Project Closure has been created: <b><a href="#Form/Project Closure/{cc}">{cc}</a></b>""".format(cc=cc)
        frappe.msgprint(msg)
        


@frappe.whitelist()
def get_project_detail_controlling(project, company=None):
    project_dict = frappe.db.sql("""select * from `tabProject Implementation Monitoring and Controlling` where project_name=%s""", (project), as_dict=1)
    if not project_dict:
        frappe.throw("Project Implementation Monitoring and Controlling phase for project {0} not found".format(project))

    change_request = frappe.db.sql(""" select * from `tabControl Change Request` where parent=(select name from `tabProject Implementation Monitoring and Controlling` where project_name=%s) """, (project), as_dict=1)
    project_issues_sumary = frappe.db.sql(""" select * from `tabProject Issues Sumary` where parent=(select name from `tabProject Implementation Monitoring and Controlling` where project_name=%s) """, (project), as_dict=1)

    details = project_dict[0]

    return details,change_request,project_issues_sumary

