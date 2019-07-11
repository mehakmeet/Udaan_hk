const express=require('express');
const app=express();
const path=require('path');
const assets=require('./assests');
const tasks=require('./tasks');
const taskdetails=require('./task_detail');
const worker=require('./workers');
const fs=require('fs');

const logger=(req,res,next)=>{
	console.log("Test");
	next();
}

app.use(logger);

app.use(express.static(path.join(__dirname,'public')));

//GET 1st aPI
app.get('/assets/all', (req,res) => {

	res.json(assets);
});
// PORT 
//2nd API
app.get('/get-tasks-for-worker/:id',(req,res)=>{
	
	const found=tasks.some(tasks=>tasks.workerId===(req.params.id));

	if(found){
		res.json(tasks.filter(tasks=>tasks.workerId===(req.params.id)));
	}else {
		res.status(400).json({msg:'No member with this ID'});
	}

});

//POST starts here----
app.use(express.json());//Body parser
app.use(express.urlencoded({extended:false}));

//1stAPI
app.post('/add-asset',(req,res)=>{
	
	const newMember={
		assestId: assets.length+1,
		name: req.body.name
	}

	if(!newMember.name)
	{
		return res.status(400).json({msg:'Please include name od the Asset'});
	}

	assets.push(newMember);
	res.json(assets);
});

//2ndAPI  //task

app.post('/add-tasks',(req,res)=>{
	
	const newTask={
		taskId: taskdetails.length+1,
		desc: req.body.desc,
		freq: req.body.freq,
	};

	if(!newTask.desc || !newTask.freq)
	{
		return res.status(400).json({msg:'Please include description of the task'});
	}

	taskdetails.push(newTask);
	res.json(taskdetails);
});

//3rd API //worker

app.post('/add-worker',(req,res)=>{
	
	const newWorker={
		workerId: worker.length+1,
		name: req.body.name
	};

	if(!newWorker.name)
	{
		return res.status(400).json({msg:'Please include description of the task'});
	}

	worker.push(newWorker);
	res.json(worker);
});

//4th API //Allocate tasks
/*
assetId:"1",
	taskId:"1",
	workerId:"1",
	timeOfAllocation: new Date(2018,11,24),
	taskToBePerformedBy: new Date(2018,11,24)*/

app.post('/allocate-task',(req,res)=>{
	
	const newTask={
	
		taskId: String.valueOf(tasks.length+1),
		assetId: req.body.assetId,
		workerId: req.body.workerId,
		timeOfAllocation: req.body.timeAlloc,
		taskToBePerformedBy: req.body.tasktoPerform,
	};

	if(!newTask.assestId || !newTask.workerId || !newTask.timeOfAllocation || !newTask.taskToBePerformedBy)
	{
		return res.status(400).json({msg:'Please include description of the task'});
	}

	tasks.push(newTask);
	res.json(tasks);
});

const PORT= process.env.PORT || 5000;


app.listen(PORT,()=> console.log(`Listening on port ${PORT}`));