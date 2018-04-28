// Copyright (c) 2018, s and contributors
// For license information, please see license.txt

frappe.ui.form.on('Project Gantt', {

	onload: function(frm){
		frm.add_custom_button(__("Save Data"), function() {
			if (frm.project_gantt){
				var gantt_tasks = [];
					
				frm.project_gantt.eachTask(function(task){
					gantt_tasks.push(task);
				});

				frappe.call({
		            method: 'pmo.project_services.doctype.project_gantt.project_gantt.save_tasks',
		            args: {
		                'tasks': gantt_tasks,
		                'project_name': frm.doc.project
		            },
		            freeze: true,
		            freeze_message: "Saving Data..",
		            // async: false,
		            callback: function(r) {
		            	if(!r.exc){
		            		var links = frm.project_gantt.getLinks();

		            		if(links){
			            		frappe.call({
						            method: 'pmo.project_services.doctype.project_gantt.project_gantt.save_links',
						            args: {
						                'links': links,
						                'project_name': frm.doc.project
						            },
						            freeze: true,
						            freeze_message: "Saving Links..",
						            // async: false,
						            callback: function(r) {
						            	if(!r.exc){
						            		// console.log(r.message);
						            		// frappe.msgprint(__("Data & Links are Saved"));
						            	}
						            	
						            	// console.log(r.message);
						            	// console.log(gantt_tasks);
						            }
						        });
						    }
		            	}
		            	
		            	// console.log(r.message);
		            	// console.log(gantt_tasks);
		            }
		        });
			}
		});

	},

	refresh: function(frm) {
		frm.disable_save();
	},
	project: function(frm){
		var project_gantt = {};
		// var load_c = 0;

		var data = [];
		// var links = [];
		var selected_project = frm.doc.project;
		if(selected_project){
			frappe.model.with_doc("Project", selected_project, function(r) {
				var project_doc = frappe.model.get_doc("Project", selected_project);

				project_gantt = Gantt.getGanttInstance();

            	var expected_start_date = moment(project_doc.expected_start_date).format("DD-MM-YYYY");
            	var duration = moment(project_doc.expected_end_date).diff(project_doc.expected_start_date, "days");

				project_doc["id"] = project_doc.name;
				// project_doc["duration"] = duration;
				project_doc["start_date"] = expected_start_date;
				project_doc["text"] = project_doc.project_name;
				// project_doc["progress"] = 0.4;
				project_doc["type"]=project_gantt.config.types.project;

				data.push(project_doc);
				
				calculate_progress(project_gantt);
				

				project_gantt.config.open_tree_initially = true;
				gantt.config.columns=[
					{name:"text",       label:"Task name",  tree:true, width:'*' },
					{name:"start_date", label:"Start time", align: "center" },
					{name:"duration",   label:"Duration",   align: "center" },
					{name:"add",        label:"" }
				];

				project_gantt.config.show_progress = true;
				project_gantt.init("gantt_here");
				project_gantt.parse({"data": data});

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
		            callback: function(r) {
		            	
		                if (r.message) {							
							var tasks = r.message;
							var links = [];
							for (var i in tasks){
								// rs = frappe.model.get_value('Task', {'name': tasks[i].name}, 'exp_end_date');
								// console.log("////////////",rs);
								add_additional_data(project_gantt, tasks[i], selected_project);
								// console.log(tasks[i]);
								// console.log(project_gantt.getTask(tasks[i].id));
							}

							frappe.call({
					            method: 'pmo.project_services.doctype.project_gantt.project_gantt.get_links',
					            args: {
					                'project_name': selected_project,
					            },
					            freeze: true,
					            freeze_message: "Loading Gantt..",
					            // async: false,
					            callback: function(r) {
					            	if(r.message){
					            		depends_on = r.message;
					            		
					            		for (var i in depends_on){

					            			project_gantt.addLink({
					            				"id": depends_on[i].id,
					            				"source": depends_on[i].task,
					            				"target": depends_on[i].parent,
					            				"type": depends_on[i].type,
					            				"name": depends_on[i].name
					            			});
					            			// links.push({
					            			// 	"id": depends_on[i].id,
					            			// 	"source": depends_on[i].task,
					            			// 	"target": depends_on[i].parent,
					            			// 	"type": depends_on[i].type
					            			// });
					            		}
					            		// console.log(links);

					            		// frappe.msgprint(__("Data & Links are Saved"));
					            	}
					            	
					            	// console.log(r.message);
					            	// console.log(gantt_tasks);
					            }
						    });

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
							

							project_gantt.parse({"data": tasks});
							project_gantt.refreshData();
							frm["project_gantt"] = project_gantt; 
		               	
		                }
		                // gantt.render();
		                // gantt.refreshData();
		            }
    			});
    			event_handlers(project_gantt);

			});
		}
	}
});

function add_additional_data(project_gantt, task, project_name){
	if(task){
		// task comes from db
		if ("name" in task){
			var exp_start_date = moment(task.exp_start_date).format("DD-MM-YYYY");
			var task_duration = moment(task.exp_end_date).diff(task.exp_start_date, "days");

			task["id"] = task.name;
			task["duration"] = task_duration;
			task["start_date"] = exp_start_date;
			task["text"] = task.subject;
			task["progress"] = task["progress"] / 100;
			task["doctype"] = "Task";

			if(!task.parent_task){
				task["parent"] = project_name;
			}
			else{
				task["parent"] = task["parent_task"];

				
			}
			project_gantt.addTask(task);
		}
		// task newly added to gantt
		// else{
			
		// 	task["project"] = project_name;

		// }
		
	}
}

function event_handlers(project_gantt){
	// var types = project_gantt.config.links;
	project_gantt.attachEvent("onAfterTaskUpdate", function(id,item){
		

		console.log(item.progress);
	});
	project_gantt.attachEvent("onAfterLinkAdd", function(id,item){
    	console.log(item);
	});

	project_gantt.attachEvent("onAfterTaskAdd", function(id,task){
		if(task.type == "task" && !("is_group" in task)){
			if(project_gantt.hasChild(task.id)){
				task["is_group"] = 1;
			}
			else{
				task["is_group"] = 0;
			}
		}
		// if(cur_frm.doc.project){
  //   		add_additional_data(project_gantt, task, cur_frm.doc.project)
  //   	}
	});

	project_gantt.attachEvent("onBeforeTaskAdd", function(id,task){
		task["type"]=project_gantt.config.types.project;
	});

	// project_doc["type"]=project_gantt.config.types.project;
	// project_gantt.attachEvent("onLinkValidation", function(link){
	// 	// if (link.type == "1" || link.type == "2" || link.type == "3"){
	// 	// 	return false;
	// 	// }
	// });
}

function calculate_progress(project_gantt){
	/*calculate progress dynamically */
	(function dynamicTaskType() {
		var delTaskParent;

		function checkParents(id) {
			setTaskType(id);
			var parent = project_gantt.getParent(id);
			if (parent != project_gantt.config.root_id) {
				checkParents(parent);
			}
		}

		function setTaskType(id) {
			id = id.id ? id.id : id;
			var task = project_gantt.getTask(id);
			var type = project_gantt.hasChild(task.id) ? project_gantt.config.types.project : project_gantt.config.types.task;
			if (type != task.type) {
				task.type = type;
				project_gantt.updateTask(id);
			}
		}

		project_gantt.attachEvent("onParse", function () {
			project_gantt.eachTask(function (task) {
				setTaskType(task);
			});
		});

		project_gantt.attachEvent("onAfterTaskAdd", function onAfterTaskAdd(id) {
			project_gantt.batchUpdate(checkParents(id));

		});

		project_gantt.attachEvent("onBeforeTaskDelete", function onBeforeTaskDelete(id, task) {
			delTaskParent = project_gantt.getParent(id);
			return true;
		});

		project_gantt.attachEvent("onAfterTaskDelete", function onAfterTaskDelete(id, task) {
			if (delTaskParent != project_gantt.config.root_id) {
				project_gantt.batchUpdate(checkParents(delTaskParent));
			}
		});

	})();

	// recalculate progress of summary tasks when the progress of subtasks changes
	(function dynamicProgress() {

		function calculateSummaryProgress(task) {
			if (task.type != project_gantt.config.types.project)
				return task.progress;
			var totalToDo = 0;
			var totalDone = 0;
			project_gantt.eachTask(function (child) {
				if (child.type != project_gantt.config.types.project) {
					totalToDo += child.duration;
					totalDone += (child.progress || 0) * child.duration;
				}
			}, task.id);
			if (!totalToDo) return 0;
			else return totalDone / totalToDo;
		}

		function refreshSummaryProgress(id, submit) {
			if (!project_gantt.isTaskExists(id))
				return;

			var task = project_gantt.getTask(id);
			task.progress = calculateSummaryProgress(task);

			if (!submit) {
				project_gantt.refreshTask(id);
			} else {
				project_gantt.updateTask(id);
			}

			if (!submit && project_gantt.getParent(id) !== project_gantt.config.root_id) {
				refreshSummaryProgress(project_gantt.getParent(id), submit);
			}
		}


		project_gantt.attachEvent("onParse", function () {
			project_gantt.eachTask(function (task) {
				task.progress = calculateSummaryProgress(task);
			});
		});

		project_gantt.attachEvent("onAfterTaskUpdate", function (id) {
			refreshSummaryProgress(project_gantt.getParent(id), true);

		});

		project_gantt.attachEvent("onTaskDrag", function (id) {
			refreshSummaryProgress(project_gantt.getParent(id), false);
		});
		project_gantt.attachEvent("onAfterTaskAdd", function (id) {
			refreshSummaryProgress(project_gantt.getParent(id), true);
		});


		(function () {
			var idParentBeforeDeleteTask = 0;
			project_gantt.attachEvent("onBeforeTaskDelete", function (id) {
				idParentBeforeDeleteTask = project_gantt.getParent(id);
			});
			project_gantt.attachEvent("onAfterTaskDelete", function () {
				refreshSummaryProgress(idParentBeforeDeleteTask, true);
			});
		})();
	})();

	project_gantt.config.lightbox.sections = [
		{name: "description", height: 70, map_to: "text", type: "textarea", focus: true},
		{name: "time", type: "duration", map_to: "auto"}
	];

	project_gantt.config.scale_unit = "month";
	project_gantt.config.date_scale = "%F, %Y";

	project_gantt.config.scale_height = 50;

	project_gantt.config.subscales = [
		{unit: "day", step: 1, date: "%j, %D"}
	];

	project_gantt.templates.progress_text = function (start, end, task) {
		return "<span style='text-align:left;'>" + Math.round(task.progress * 100) + "% </span>";
	};

	project_gantt.templates.task_class = function (start, end, task) {
		if (task.type == project_gantt.config.types.project)
			return "hide_project_progress_drag";
	};



}