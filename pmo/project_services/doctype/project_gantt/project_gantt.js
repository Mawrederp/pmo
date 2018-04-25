// Copyright (c) 2018, s and contributors
// For license information, please see license.txt

frappe.ui.form.on('Project Gantt', {
	refresh: function(frm) {
		frm.disable_save();
	},
	project: function(frm){
		var project_gantt = {};
		// var load_c = 0;

		var data = [];
		var links = [];
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
				project_doc["text"] = project_doc.name;
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
							tasks = r.message;
							for (var i in tasks){
								var exp_start_date = moment(tasks[i].exp_start_date).format("DD-MM-YYYY");
								var task_duration = moment(tasks[i].exp_end_date).diff(tasks[i].exp_start_date, "days");

								tasks[i]["id"] = tasks[i].name;
								tasks[i]["duration"] = task_duration;
								tasks[i]["start_date"] = exp_start_date;
								tasks[i]["text"] = tasks[i].subject;

								if(!tasks[i].parent_task){
									tasks[i]["parent"] = project_doc.name;
								}
								else{
									tasks[i]["parent"] = tasks[i]["parent_task"];
								}
								
								project_gantt.addTask(tasks[i]);
								
								// console.log(project_gantt.getTask(tasks[i].id));
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
							

							project_gantt.parse({"data": tasks});
							// project_gantt.refreshData();
		               	
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

function event_handlers(project_gantt, load_c){
	project_gantt.attachEvent("onAfterTaskUpdate", function(id,item){
		

		console.log(item);
	});
	project_gantt.attachEvent("onAfterLinkAdd", function(id,item){
    	console.log(item);
	});
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