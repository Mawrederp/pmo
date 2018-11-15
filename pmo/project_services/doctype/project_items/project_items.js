// Copyright (c) 2018, s and contributors
// For license information, please see license.txt

frappe.ui.form.on('Project Items', {
	refresh: function(frm) {

	},
	onload: function(frm){
		cur_frm.set_query("advanced_section", function() {
            return {
                query: "pmo.project_services.doctype.project_items.project_items.get_section_name"
            };
        });
	},
	validate: function(frm) {
		if(cur_frm.doc.item){
			frm.set_value('status', "Active");
		}else{
			frm.set_value('status', "New");
		}
	},
	item: function(frm) {
		if(cur_frm.doc.item){
			frm.set_value('status', "Active");
		}else{
			frm.set_value('status', "New");
		}
	}	
});
