// Copyright (c) 2018, s and contributors
// For license information, please see license.txt

cur_frm.add_fetch('employee', 'user_id', 'user_id');

frappe.ui.form.on('PMO Resources', {
	refresh: function(frm) {
		frm.refresh_field("accounts");
		

		frappe.call({
	            "method": "check_emp",
	            doc: cur_frm.doc,
	            callback: function(r) {
	        		if(r.message){
	        			if(r.message==1){

	        				frm.add_custom_button(__("Send Email"), function () {
								arr = []
								for(row= 0;row<cur_frm.doc.role_assignment.length;row++){
									if(cur_frm.doc.role_assignment[row].notification == 1){
										arr.push(cur_frm.doc.role_assignment[row].employee)
									}

								}

								frappe.call({
						            "method": "send_notifications",
						            doc: cur_frm.doc,
						            args: { "employee": arr }
						          //   callback: function(r) {
						        		// if(r.message){
						        		// 	console.log(r.message)
						        		// }  	
						          //   }
						        });


					        });



	        			}
	        		}  	
	            }
	        });


		frm.set_query("employee", function() {
        return {
                query: "pmo.project_services.doctype.pmo_resources.pmo_resources.get_employee",
                filters: {
                    employee: frm.doc.employee
                }
            };
        });
		
	},
	// onload: function(frm) {
	// 	frappe.call({
 //            "method": "check_assigned_project",
 //            doc: cur_frm.doc,
 //            args: { "user_id": cur_frm.doc.user_id },
 //            callback: function(r) {
     	
 //        		$.each(frm.doc.role_assignment, function(index, row){
	// 				for(var i = 0 ;i<r.message[0].length;i++){
 //            			console.log(r.message[0][i])
	// 					frappe.model.set_value(row.doctype, row.name, "assigned_project", r.message[0][i]+"\n");
	// 				}
	// 			})
            	
 //            }
 //        });
	// },
	employee: function(frm) {
		arr = []
		if(cur_frm.doc.user_id){
			frappe.call({
	            "method": "check_role",
	            doc: cur_frm.doc,
	            args: { "user_id": cur_frm.doc.user_id },
	            callback: function(r) {
	            	for(var i = 0 ;i<r.message.length;i++){
	            		arr.push(r.message[i])
	            	}
	            	frm.set_value("program_manager", 0);
	            	frm.set_value("project_coordinator", 0);
	            	frm.set_value("senior_project_manager", 0);
	            	frm.set_value("project_manager", 0);

	                if (arr.includes('Program Manager')){
	                	frm.set_value("program_manager", 1);
	                }
	                if (arr.indexOf('Project Coordinator') >= 0){
	                	frm.set_value("project_coordinator", 1);
	                }
	                if (arr.includes('Senior Project Manager')){
	                	frm.set_value("senior_project_manager", 1);
	                }
	                if (arr.includes('Project Manager')){
	                	frm.set_value("project_manager", 1);
	                }
	            }
	        });
	    }
	},
    onload: function(frm) {
        $(".grid-add-row").hide();
        $(".grid-buttons").hide();
        $(".grid-footer").hide();
        $(".row-index").hide();

    }

});


