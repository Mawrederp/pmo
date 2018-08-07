from __future__ import unicode_literals
from frappe import _


def get_data():
    return [
        {
            "label": _("Projects"),
            "icon": "fa fa-star",
                "items": [
                {
                    "type": "doctype",
                    "name": "Projects List",
                    "description": _("Projects List."),
                },
                {
                    "type": "doctype",
                    "name": "Projects List",
                    "label": _("Project Details"),
                    "description": _("Projects List."),
                },
                {
                    "type": "doctype",
                    "name": "Project Gantt",
                    "label": _("Project Gantt"),
                    "description": _("Project Gantt."),
                }

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
                    "name": "Delivery Note",
                    "label": _("Delivery Note"),
                    "description": _("Delivery Note"),
                },
                {
                    "type": "doctype",
                    "name": "Projects Procurement Control",
                    "label": _("Projects Procurement Control"),
                    "description": _("Projects Procurement Control."),
                },
                {
                    "type": "doctype",
                    "name": "Project Costing Control",
                    "label": _("Project Costing Control"),
                    "description": _("Project Costing Control."),
                }
            ]
        },
        {
            "label": _("PMO Department"),
            "items": [
                {
                    "type": "doctype",
                    "name": "Policy and Procedure",
                    "label": _("Policy and Procedure"),
                    "description": _("Policy and Procedure")
                },
                {
                    "type": "doctype",
                    "name": "PMO Resources",
                    "label": _("PMO Resources"),
                    "description": _("PMO Resources")
                },
                {
                    "type": "doctype",
                    "name": "Project Management Assignment",
                    "label": _("Project Management Assignment"),
                    "description": _("Project Management Assignment")
                }
            ]
        },
         {
            "label": _("Projects Studies"),
            "items": [
                {
                    "type": "doctype",
                    "name": "Project Quotation",
                    "label": _("Project Quotation"),
                    "description": _("Project Quotation."),
                },
                {
                    "type": "doctype",
                    "name": "General Pricing",
                    "label": _("General Pricing"),
                    "description": _("General Pricing."),
                }
            ]
        }
    ]
