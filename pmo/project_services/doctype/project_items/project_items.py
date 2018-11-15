# -*- coding: utf-8 -*-
# Copyright (c) 2018, s and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class ProjectItems(Document):
    def validate(self):
        pass





@frappe.whitelist()
def get_section_name(doctype, txt, searchfield, start, page_len, filters):    
    return frappe.db.sql("""select name from `tabProject Items`
        where name not in (select advanced_section from `tabProject Items` where advanced_section is not null)
            and ({key} like %(txt)s
                or name like %(txt)s)
        order by
            if(locate(%(_txt)s, name), locate(%(_txt)s, name), 99999),
            idx desc,
            name
        limit %(start)s, %(page_len)s""".format(**{
            'key': searchfield
        }), {
            'txt': "%s%%" % txt,
            '_txt': txt.replace("%", ""),
            'start': start,
            'page_len': page_len
        })


    # return frappe.db.sql(""" select name from `tabProject Items` where name not in (select advanced_section from `tabProject Items` where advanced_section is not null) """)

