frappe.pages['projects-gantt'].on_page_load = function(wrapper) {
	var me = this;

	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Projects Gantt',
		single_column: true
	});

	page.main.html(frappe.render_template("projects_gantt", {}));
	var project = frappe.ui.form.make_control({
		parent: page.main.find(".project"),
		df: {
			fieldtype: "Link",
			options: "Project",
			fieldname: "project",
			onchange: function(){
				// gantt.clearAll();
				// page.main.html(frappe.render_template("projects_gantt", {}));
				// $('.project-details').empty();
				data = [];
        		links = [];
        		// gantt.parse({"data": data});
        		// gantt.render();
				selected_project = this.value;

				frappe.model.with_doc("Project", selected_project, function(r) {
					var proj = frappe.model.get_doc("Project", selected_project);
					// frappe.query_report_filters_by_name.from_date.set_input(fy.year_start_date);
					// frappe.query_report_filters_by_name.to_date.set_input(fy.year_end_date);
					// query_report.trigger_refresh();

                	// Project Start Date and end date Should be mandatory
                	// var expected_start_date = convert_to_ddmmyyyy(proj.expected_start_date);
                	var expected_start_date = moment(proj.expected_start_date).format("DD-MM-YYYY");
                	var duration = moment(proj.expected_end_date).diff(proj.expected_start_date, "days");

                	project_info = {id: proj.name, text: proj.name, start_date: expected_start_date, duration: duration,
						progress: 0.4, open: false};
					// console.log();
					// project_link = {id: proj.id, source: proj.source, target: proj.target, type: "1"};

					data.push(project_info);
					// links.push(project_link)
					// gantt.clearAll();
					var project_gantt = Gantt.getGanttInstance();
					
					// project_gantt.config.autofit = false;
					project_gantt.config.open_tree_initially = true;
					gantt.config.columns=[
						{name:"text",       label:"Task name",  tree:true, width:'*' },
						{name:"start_date", label:"Start time", align: "center" },
						{name:"duration",   label:"Duration",   align: "center" },
						{name:"add",        label:"" }
					];

					project_gantt.init("gantt_here");
					project_gantt.parse({"data": data});
					// gantt.refreshData();
					// console.log(data);
					
					frappe.call({
			            method: 'frappe.client.get_list',
			            args: {
			                'doctype': 'Task',
			                'filters': { 'project': selected_project },
			                'order_by': "exp_end_date",
			                'fields': '*'
			            },
			            freeze: true,
			            freeze_message: "Loading Gantt..",
			            // async: false,
			            callback: function(r) {
			            	
			            	// !r.exc
			                if (r.message) {							
			                	console.log(r.message)
								tasks = r.message;
								for (var i in tasks){
									var exp_start_date = moment(tasks[i].exp_start_date).format("DD-MM-YYYY");
									var task_duration = moment(tasks[i].exp_end_date).diff(tasks[i].exp_start_date, "days");
									tasks[i]["id"] = tasks[i].name;
									tasks[i]["duration"] = task_duration;
									tasks[i]["start_date"] = exp_start_date;
									tasks[i]["text"] = tasks[i].subject;

									if(!tasks[i].parent_task){
										tasks[i]["parent"] = proj.name;
										// var pt = tasks[i].parent_task;
										// tasks[i]["parent"] = pt;
									}
									else{
										tasks[i]["parent"] = tasks[i]["parent_task"];
									}
									console.log(tasks[i]["parent"])
									// else{
									// 	tasks[i]["parent"] = proj.name;
									// }
									console.log(tasks[i]);

									// console.log(tasks[i]);
									// tasks[i]["order"] = tasks[i].idx+2;
									// data.push(tasks[i])
									project_gantt.addTask(tasks[i]);
									

								}
								// project_gantt.render();
								// project_links = proj.links;
								// for (var i in project_links){
								// 	// console.log(proj.links);
								// 	project_links[i]["id"] = project_links[i].name;
								// 	project_gantt.addLink(project_links[i]);
								// 	// links.push(project_links[i]);
								// }
								// console.log(gantt.getTask("TASK00002"));
								// gantt.init("gantt_here");
								// project_gantt.refreshData();

								project_gantt.parse({"data": tasks});
			               	
			                }
			                // gantt.render();
			                // gantt.refreshData();
			            }
        			});
				});

				
				// console.log(project.get_value())
				// page.main.find(".frappe-list").html("");

				// // show_project_info(project.get_value(), me);
				// // show_project_info_planning(project.get_value(), me);
				// // show_project_info_controlling(project.get_value(), me);
				// // show_project_info_closure(project.get_value(), me);

				// $(".project-details").css("display","block")
				
				// show_project_info(project.get_value(), me);
				// $(".project-details .row .project-phases .tab .inititaion").click(function(){
				//     show_project_info(project.get_value(), me);
				// });
				// $(".project-details .row .project-phases .tab .planning").click(function(){
				//     show_project_info_planning(project.get_value(), me);
				// });
				// $(".project-details .row .project-phases .tab .controlling").click(function(){
				//     show_project_info_controlling(project.get_value(), me);
				// });
				// $(".project-details .row .project-phases .tab .closure").click(function(){
				//     show_project_info_closure(project.get_value(), me);
				// });

			}
		},
		only_input: true,
	});
	project.refresh();

	// me.page.set_primary_action(__("Transfer"), function() {
	// 	alert("dfdf");
	// // me.page.list.filter_list.clear_filters();
	// // me.page.list.run();
	// });

}

// function convert_to_ddmmyyyy(date){
// 	if (date){
// 		var nf_date = new Date(date);
		
// 		var s_days = nf_date.getDate().toString();
// 		var s_months = (nf_date.getMonth()+1).toString();

// 		var days = s_days.length <= 1 ? "0"+ s_days : s_days;
// 		var months = s_months.length <= 1 ? "0"+ s_months : s_months; 
// 		var years = nf_date.getFullYear().toString();
// 		return days+"-"+months+"-"+years;
// 	}
// }