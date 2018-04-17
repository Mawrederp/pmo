from __future__ import unicode_literals
from frappe import _

def get_data():
	return [
		{
			"label": _("Projects"),
			"icon": "fa fa-star",
			"items": [
				# {
				# 	"type": "doctype",
				# 	"name": "Project",
				# 	"description": _("Project master."),
				# },
				{
					"type": "doctype",
					"name": "Projects List",
					"description": _("Projects List."),
				},
				# {
				# 	"type": "doctype",
				# 	"name": "Project Initiation",
				# 	"description": _("Project Initiation."),
				# },
				{
					"type": "page",
					"name": "project-info",
					"label": _("Project Details"),
					"description": _("Project Details")
				}
				# {
				# 	"type": "doctype",
				# 	"name": "Project Planning",
				# 	"description": _("Project Planning."),
				# },
				# {
				# 	"type": "doctype",
				# 	"name": "Project Implementation Monitoring and Controlling",
				# 	"description": _("Project Implementation Monitoring and Controlling."),
				# },
				# {
				# 	"type": "doctype",
				# 	"name": "Project Closure",
				# 	"description": _("Project Closure."),
				# }
			]
		},
		{
			"label": _("Projects Control"),
			"items": [
				{
					"type": "doctype",
					"name": "Project Billing Control",
					"label": _("Projects Billing Control"),
					"description": _("Project Billing Control."),
				},
				{
					"type": "doctype",
					"name": "Projects Procurement Control",
					"label": _("Projects Procurement Control"),
					"description": _("Projects Procurement Control."),
				}
			]
		}
	]
