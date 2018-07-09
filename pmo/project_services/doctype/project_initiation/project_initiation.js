// Copyright (c) 2018, s and contributors
// For license information, please see license.txt

frappe.ui.form.on('Project Initiation', {
	refresh: function(frm) {

        frm.add_custom_button(__("Project Initiation"), function () {

        });


        frm.add_custom_button(__("Project Planning"), function () {
            frappe.call({
                "method": "existing_project_planning",
                doc: cur_frm.doc,
                callback: function(r) {
                frappe.set_route("Form", "Project Planning", r.message);
                }
            });

        });


        frm.add_custom_button(__("Project Implementation, Monitoring and Controlling"), function () {
            frappe.call({
                "method": "existing_project_controlling",
                doc: cur_frm.doc,
                callback: function(r) {
                frappe.set_route("Form", "Project Implementation Monitoring and Controlling", r.message);
                }
            });

        });


        frm.add_custom_button(__("Project Closure"), function () {
            frappe.call({
                "method": "existing_project_closure",
                doc: cur_frm.doc,
                callback: function(r) {
                frappe.set_route("Form", "Project Closure", r.message);
                }
            });

        });

        $(".layout-main-section .form-inner-toolbar button:nth-child(1)").removeClass("btn-default");
        $('.layout-main-section .form-inner-toolbar :nth-child(1)').before('<b><p style="text-align: center;font-size: 25px;">Project Phases</p></b>');
        $('.layout-main-section-wrapper .layout-main-section .form-inner-toolbar').after('<style>.layout-main-section-wrapper .layout-main-section .form-inner-toolbar{height: 100px !important;}</style>');
        $('.layout-main-section-wrapper .layout-main-section .form-inner-toolbar').after('<style>.layout-main-section-wrapper .layout-main-section .form-inner-toolbar button:nth-child(n+1){float: left !important;}.layout-main-section-wrapper .layout-main-section .form-inner-toolbar button{font-weight: bold!important;}</style>');
        

	},
	onload: function(frm){
		cur_frm.refresh_fields(["workflow_state"]);
	},
	workflow_state: function(frm){
        cur_frm.refresh_fields(["workflow_state"]);
    },
	project_sponsor : function (frm){
        if (cur_frm.doc.project_sponsor ){
        	frm.set_value("project_sponsor_ch", cur_frm.doc.project_sponsor );
        	frm.set_value("project_sponsor_name_ch", cur_frm.doc.project_sponsor_name );
        }
	},
	project_owner : function (frm){
        if (cur_frm.doc.project_owner ){
        	frm.set_value("project_owner_ch", cur_frm.doc.project_owner );
        	frm.set_value("project_owner_name_ch", cur_frm.doc.project_owner_name );
        }
	},
	project_manager : function (frm){
        if (cur_frm.doc.project_manager ){
        	frm.set_value("project_managr_ch", cur_frm.doc.project_manager );
        	frm.set_value("project_manager_name_ch", cur_frm.doc.project_manager_name );
        }
	},
	account : function (frm){
        if (cur_frm.doc.account ){
        	frm.set_value("account_ch", cur_frm.doc.account );
        }
	},
	customer : function (frm){
        if (cur_frm.doc.customer ){
        	frm.set_value("customer_ch", cur_frm.doc.customer );
        }
	},
	customer_project_manager : function (frm){
        if (cur_frm.doc.customer_project_manager ){
        	frm.set_value("customer_project_manager_ch", cur_frm.doc.customer_project_manager );
        }
	},
	customer_project_sponsor : function (frm){
        if (cur_frm.doc.customer_project_sponsor ){
        	frm.set_value("customer_project_sponsor_ch", cur_frm.doc.customer_project_sponsor );
        }
	},
    customer_project_owner : function (frm){
        if (cur_frm.doc.customer_project_owner ){
        	frm.set_value("customer_project_owner_ch", cur_frm.doc.customer_project_owner );
        }
	},
	po_number : function (frm){
        if (cur_frm.doc.po_number ){
        	frm.set_value("po_number_ch", cur_frm.doc.po_number );
        }
	},
	po_date : function (frm){
        if (cur_frm.doc.po_date ){
        	frm.set_value("po_date_ch", cur_frm.doc.po_date );
        }
	},
	customer_department : function (frm){
        if (cur_frm.doc.customer_department ){
        	frm.set_value("customer_department_ch", cur_frm.doc.customer_department );
        }
	},
	start_date : function (frm){
        if (cur_frm.doc.start_date ){
        	frm.set_value("expected_start_date", cur_frm.doc.start_date );
        }
	},
	end_date : function (frm){
        if (cur_frm.doc.end_date ){
        	frm.set_value("expected_end_date", cur_frm.doc.end_date );
        }
	},
    employee : function (frm){
        if (cur_frm.doc.employee ){
            frm.set_value("employee_ch", cur_frm.doc.employee );
        }
    },
    end_users : function (frm){
        if (cur_frm.doc.end_users ){
            frm.set_value("end_users_ch", cur_frm.doc.end_users );
        }
    },
    concerned_department : function (frm){
        if (cur_frm.doc.concerned_department ){
            frm.set_value("concerned_department_ch", cur_frm.doc.concerned_department );
        }
    },
    total_cost_price: function(frm) {

    	total_overall_profit = flt(cur_frm.doc.total_final_selling_price) - flt(cur_frm.doc.total_cost_price) ;
    	frm.set_value("overall_project_profit",total_overall_profit);

    	total_overall_markup = flt(cur_frm.doc.overall_project_profit) /flt(cur_frm.doc.total_cost_price) * 100;
    	frm.set_value("overall_project_markup",total_overall_markup);

        total_overall_margin= flt(cur_frm.doc.overall_project_profit) /flt(cur_frm.doc.total_final_selling_price) * 100;
    	frm.set_value("overall_project_margin",total_overall_margin);


	},
	total_final_selling_price: function(frm) {

    	total_overall_profit = flt(cur_frm.doc.total_final_selling_price) - flt(cur_frm.doc.total_cost_price) ;
    	frm.set_value("overall_project_profit",total_overall_profit);

    	total_overall_markup = flt(cur_frm.doc.overall_project_profit) /flt(cur_frm.doc.total_cost_price) * 100;
    	frm.set_value("overall_project_markup",total_overall_markup);

        total_overall_margin= flt(cur_frm.doc.overall_project_profit) /flt(cur_frm.doc.total_final_selling_price) * 100;
    	frm.set_value("overall_project_margin",total_overall_margin);


	},
	validate: function(frm){

		// $("div.btn-group.actions-btn-group.open").find("a.grey-link").each(function() {
		// 	// if($(this).html())
		// 	console.log( $(this).html() );
		// });


		cur_frm.refresh_fields(["workflow_state"]);
		
		grand_total = 0;
	    $.each(frm.doc.project_financial_detail || [], function(i, d) {
	        grand_total += flt(d.cost_price);
	    });
	    frm.set_value("total_cost_price", grand_total);

	    total = 0;
        $.each(frm.doc.project_financial_detail || [], function(i, d) {
        	total += flt(d.final_selling_price);
        });
    	frm.set_value("total_final_selling_price", total);

    	total_overall_profit = flt(cur_frm.doc.total_final_selling_price) - flt(cur_frm.doc.total_cost_price) ;
    	frm.set_value("overall_project_profit",total_overall_profit);

    	total_overall_markup = flt(cur_frm.doc.overall_project_profit) /flt(cur_frm.doc.total_cost_price) * 100;
    	frm.set_value("overall_project_markup",total_overall_markup);

        total_overall_margin= flt(cur_frm.doc.overall_project_profit) /flt(cur_frm.doc.total_final_selling_price) * 100;
    	frm.set_value("overall_project_margin",total_overall_margin);

    	billing_total = 0;
    	$.each(frm.doc.project_payment_schedule || [], function(i, d) {
        billing_total += flt(d.items_value);
    	});
    	frm.set_value("total_billing", billing_total);

        cost_value_total = 0;
        $.each(frm.doc.project_costing_schedule || [], function(i, d) {
            cost_value_total += flt(d.items_cost_price);
        });
        frm.set_value("total_cost_value",cost_value_total);
	}

});


frappe.ui.form.on("Project Financial Details", "cost_price", function(frm, cdt, cdn) {
    // code for calculate total and set on parent field.
    grand_total = 0;
    $.each(frm.doc.project_financial_detail || [], function(i, d) {
        grand_total += flt(d.cost_price);
    });
    frm.set_value("total_cost_price", grand_total);
});


frappe.ui.form.on("Project Financial Details", "final_selling_price", function(frm, cdt, cdn) {
    // code for calculate total and set on parent field.
    total = 0;
    $.each(frm.doc.project_financial_detail || [], function(i, d) {
        total += flt(d.final_selling_price);
    });
    frm.set_value("total_final_selling_price", total);
});


frappe.ui.form.on("Project Payment Schedule", "items_value", function(frm, cdt, cdn) {
    // code for calculate total and set on parent field.
    billing_total = 0;
    $.each(frm.doc.project_payment_schedule || [], function(i, d) {
        billing_total += flt(d.items_value);
    });
    frm.set_value("total_billing",billing_total);
});

frappe.ui.form.on("Project Costing Schedule", "cost_value", function(frm, cdt, cdn) {
    // code for calculate total and set on parent field.
    cost_value_total = 0;
    $.each(frm.doc.project_costing_schedule || [], function(i, d) {
        cost_value_total += flt(d.items_cost_price);
    });
    frm.set_value("total_cost_value",cost_value_total);
});



frappe.ui.form.on('Project Financial Details', {
    selling_price: function (frm, cdt, cdn) {
        var row = locals[cdt][cdn];
        if(row.selling_price || row.additions_value){
			frappe.model.set_value(cdt, cdn, "final_selling_price", row.selling_price + row.additions_value);

		}

    },
    additions_value: function (frm, cdt, cdn) {
        var row = locals[cdt][cdn];
        if(row.selling_price || row.additions_value){
			frappe.model.set_value(cdt, cdn, "final_selling_price", row.selling_price + row.additions_value);

		}

    }


})


cur_frm.set_query("scope_item", "project_payment_schedule", function(doc, cdt, cdn) {
			var row = locals[cdt][cdn];
	        item_length = cur_frm.doc.project_financial_detail.length
	        item = []
	        cost = []
	        for(var i = 0; i < item_length; i++){
	        	item.push(cur_frm.doc.project_financial_detail[i].scope_item)
	        	cost.push(cur_frm.doc.project_financial_detail[i].final_selling_price)
	        }
	        // console.log(item)
	        // console.log(cost)
			var d = locals[cdt][cdn];
			return{
				filters: [
					['Item', 'name', 'in', item]
				]
			}
		});



frappe.ui.form.on('Project Payment Schedule', {
	scope_item: function (frm, cdt, cdn) {
        var row = locals[cdt][cdn];

        item_length = cur_frm.doc.project_financial_detail.length
        item = []
        cost = []
        for(var i = 0; i < item_length; i++){
        	item.push(cur_frm.doc.project_financial_detail[i].scope_item)
        	cost.push(cur_frm.doc.project_financial_detail[i].final_selling_price)
        }
        frappe.model.set_value(cdt, cdn, "items_value", cost[item.indexOf(row.scope_item)]);

    },
    items_value: function (frm, cdt, cdn) {
        var row = locals[cdt][cdn];
        if(row.items_value && row.billing_percentage){
			frappe.model.set_value(cdt, cdn, "billing_value", row.billing_percentage/100 * row.items_value);

		}

    },
    billing_percentage: function (frm, cdt, cdn) {
        var row = locals[cdt][cdn];
        if(row.items_value && row.billing_percentage){
			frappe.model.set_value(cdt, cdn, "billing_value", row.billing_percentage/100 * row.items_value);

		}

    }


})



cur_frm.set_query("scope_item", "project_costing_schedule", function(doc, cdt, cdn) {
			var row = locals[cdt][cdn];
	        item_length = cur_frm.doc.project_financial_detail.length
	        item = []
	        cost = []
	        for(var i = 0; i < item_length; i++){
	        	item.push(cur_frm.doc.project_financial_detail[i].scope_item)
	        	cost.push(cur_frm.doc.project_financial_detail[i].final_selling_price)
	        }
	        // console.log(item)
	        // console.log(cost)
			var d = locals[cdt][cdn];
			return{
				filters: [
					['Item', 'name', 'in', item]
				]
			}
		});


frappe.ui.form.on('Project Costing Schedule', {
	scope_item: function (frm, cdt, cdn) {
        var row = locals[cdt][cdn];

        item_length = cur_frm.doc.project_financial_detail.length
        item = []
        cost = []
        for(var i = 0; i < item_length; i++){
        	item.push(cur_frm.doc.project_financial_detail[i].scope_item)
        	cost.push(cur_frm.doc.project_financial_detail[i].cost_price)
        }
        frappe.model.set_value(cdt, cdn, "items_cost_price", cost[item.indexOf(row.scope_item)]);

    },
    items_cost_price: function (frm, cdt, cdn) {
        var row = locals[cdt][cdn];
        if(row.items_cost_price && row.cost_value_percentage){
			frappe.model.set_value(cdt, cdn, "cost_value", row.cost_value_percentage/100 * row.items_cost_price);

		}

    },
    cost_value_percentage: function (frm, cdt, cdn) {
        var row = locals[cdt][cdn];
        if(row.items_cost_price && row.cost_value_percentage){
			frappe.model.set_value(cdt, cdn, "cost_value", row.cost_value_percentage/100 * row.items_cost_price);

		}

    }

});



//Including General Pricing items on the Project Initiation.
frappe.ui.form.on("Project Initiation", "general_pricing", function(frm) {
    cur_frm.doc.project_financial_detail = []
    frappe.model.with_doc("General Pricing", frm.doc.general_pricing, function() {
        var tabletransfer= frappe.model.get_doc("General Pricing", frm.doc.general_pricing)
        $.each(tabletransfer.project_quotation, function(index, row){
            d = frm.add_child("project_financial_detail");
            d.scope_item = row.items;
            d.selling_price = row.selling_price;
            d.cost_price = row.total_cost_price;
            d.additions_value = row.risk_contingency;
            d.final_selling_price = row.total_selling_price;
            frm.refresh_field("project_financial_detail");
        });
    })
});


