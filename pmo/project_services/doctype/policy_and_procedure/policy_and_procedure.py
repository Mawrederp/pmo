# -*- coding: utf-8 -*-
# Copyright (c) 2018, s and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class PolicyandProcedure(Document):
    def validate(self):
        self.send_notifications()


    def send_notifications(self):
        from frappe.core.doctype.communication.email import make
        content_msg="New Policy and Procedure were established, please check and submit it"

        # prefered_email = frappe.get_value("Employee", filters = {"name": emp}, fieldname = "prefered_email")

        # if prefered_email:
        try:
            make(subject = "Policy and Procedure Action Required", content=content_msg, recipients='ai.alamri@tawari.sa',
                send_email=True, sender="erp@tawari.sa")
        
        except:
            frappe.msgprint("could not send")

