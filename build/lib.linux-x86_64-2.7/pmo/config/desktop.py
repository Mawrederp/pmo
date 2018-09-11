# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from frappe import _

def get_data():
	return [
		{
			"module_name": "pmo",
			"color": "grey",
			"icon": "s",
			"type": "module",
			"label": _("pmo")
		}
		# {
		# 	"module_name": "project_services",
		# 	"color": "#33A0DE",
		# 	"icon": "fa fa-product-hunt",
		# 	"type": "module",
		# 	"label": _("Projects Main Screen")
		# }
	]
