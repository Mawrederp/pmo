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

        msg = """Project Closure has been created: <b><a href="#Form/Project Closure/{0}">{0}</a></b>""".format(
            doc.name)
    	frappe.msgprint(msg)






@frappe.whitelist()
def get_project_detail_closure(project, company=None):
    project_dict = frappe.db.sql("""select * from `tabProject Closure` where project_name=%s""", (project), as_dict=1)
    if not project_dict:
        frappe.throw("Project not found")

    details = project_dict[0]

    return details

