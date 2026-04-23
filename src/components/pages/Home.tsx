	import { useState, useEffect, useRef } from 'react';
	import axios from 'axios';
	import { Loader2 } from "lucide-react";

	interface ContentItem {
		name: string;
		equipment: string;
		target: string;
		sets: number;
		reps: number;
		weight: string;
		dropsets: number;
		speed: number;
		photo:string;
		rest_time:number;
	}

	interface SetItem {
		_id?: string;
		[key: string]: any; // This is the "magic" line for set1, set2, etc.
	}

	interface ApiResponse {
		exercises: ContentItem[];
		checklist: SetItem[];
	}

	const API_URL = import.meta.env.VITE_API_BASE_URL;
	function Home() {
	    const [content, setContent] = useState<ContentItem[]>([]);
		let [setList, setListing] = useState<SetItem[]>([]);

		const mGetTable = () => {
			// In a real app, ensure your API route starts with / if it's absolute
			axios.get<ApiResponse>(`${API_URL}/api/sample`) 
				.then((res) => {
					setContent(res.data.exercises);
           			setListing(res.data.checklist);

				})
				.catch(err => console.error(err));
		};


		const mNext = () => {
			// In a real app, ensure your API route starts with / if it's absolute
			setContent([]);
			axios.post<ApiResponse>(`${API_URL}/api/next`,{content}) 
				.then((res) => {
					setContent(res.data.exercises);
           			setListing(res.data.checklist);
				})
				.catch(err => console.error(err));
		};

		const isDropSet = (item: ContentItem) => {
			let res = 0
			if(item.dropsets == 0)
				res = 1

			setContent((prevContent) => 
				prevContent.map((rec) => 
					rec.name === item.name 
						? { ...rec, dropsets: res} 
						: rec
				)
			);
		};

		const AdjustReps = (item: ContentItem, adj: string) => {
			let res = 1
			if(adj == "inc"){
				if(item.reps != 20)
					res = item.reps+1
			}
			else{
				if(item.reps != 1)
					res = item.reps-1
			}

			setContent((prevContent) => 
				prevContent.map((rec) => 
					rec.name === item.name 
						? { ...rec, reps: res} 
						: rec
				)
			);
		};

		const AdjustRest = (item: ContentItem, adj: string) => {
			let res = item.rest_time
			if(adj == "inc"){
					res = res+10
			}
			else{
				if(res != 10)
					res = res-10
			}

			setContent((prevContent) => 
				prevContent.map((rec) => 
					rec.name === item.name 
						? { ...rec, rest_time: res} 
						: rec
				)
			);
		};

		const AdjustSets = (item: ContentItem, adj: string) => {
			
			let res = item.sets
			if(adj == "inc"){
				if(res != 3)
					res = res+1
			}
			else{
				if(res != 1)
					res = res-1
			}

			setContent((prevContent) => 
				prevContent.map((rec) => 
					rec.name === item.name 
						? { ...rec, sets: res} 
						: rec
				)
			);
		};

		const AdjustSpeed = (item: ContentItem, adj: string) => {
			let res = 1
			if(adj == "inc"){
				if(item.speed != 3)
					res = item.speed+1
			}
			else{
				if(item.speed != 1)
					res = item.speed-1
			}

			setContent((prevContent) => 
				prevContent.map((rec) => 
					rec.name === item.name 
						? { ...rec, speed: res} 
						: rec
				)
			);
		};
		
		const AdjustWeight = (item: ContentItem, adj: String) => {
			let result = item.weight
			if(adj == 'inc'){
				//dumbell limit
				if(result == '3&3&3&3' && item.equipment == 'Dumbell'){
					alert('Limit exceeded')
				}
				//double dumbell limit
				else if(result == '3&3&2.5&1.25' && item.equipment == 'Dumbell2x'){
					alert('Limit exceeded')
				}
				//no weight
				else if(result == '0'){
					result = '1.25'
				}
				//3
				else if(result.slice(-1) == '3'){
					result = result.slice(0, -1) + '2.5&1.25';
				}     
				else if(result.slice(-2) == '25'){
					//2.5&1.25
					if(result.length > 7 && result.slice(-8) == '2.5&1.25')
						result = result.slice(0, -8) + '3&1.25';
					//1.25
					else
						result = result.slice(0, -4) + '2.5';
					
				}
				//2.5
				else{
					result = result.slice(0, -3) + '3';
				}
			
			
				
			}
			else{
				if(result == '0'){
					alert('Lowest Weight')
				}
				//1.25 flat
				else if(result == '1.25'){
					result = '0'
				}
				//3
				else if(result.slice(-1) == '3'){
					result = result.slice(0, -1) + '2.5';
				}     
				else if(result.slice(-2) == '25'){
					//2.5&1.25
					if(result.length > 7 && result.slice(-8) == '2.5&1.25')
						result = result.slice(0, -8) + '3';
					else if(result.length > 5 && result.slice(-6) == '3&1.25')
						result = result.slice(0, -6) + '2.5&1.25';
					//1.25
					else
						result = result.slice(0, -5);
					
				}
				//2.5
				else{
					result = result.slice(0, -3) + '1.25';
				}
			
			}
			setContent((prevContent) => 
				prevContent.map((rec) => 
					rec.name === item.name 
						? { ...rec, weight: result} 
						: rec
				)
			);
		}
		 useEffect(() => {
			mGetTable();
		}, []);

		useEffect(() => {
			outerLoop:
			for(let x=0; x < setList.length; x++){
				for(let y=0; y < content[x].sets; y++){
					if(setList[x]["set"+(y+1)] == "uncheck"){
						
						break outerLoop;
					}
				}
				if(x == setList.length-1){
					setcanDone(true)
				}
			}
		}, [setList])

		const [seconds, setSeconds] = useState(0);
		  const [isActive, setIsActive] = useState(false);
		  const [canDone, setcanDone] = useState(false);
		  const audioRef = useRef<HTMLAudioElement>(null);
		
		  useEffect(() => {
			let interval: number | undefined;
		
			if (isActive && seconds > 0) {
			  interval = setInterval(() => {
				setSeconds((prev) => prev - 1);
			  }, 1000);
			} else if (seconds === 0 && isActive) {
			  // Time's up logic
			  audioRef.current?.play().catch(() => console.log("Audio play blocked"));
			  setIsActive(false);
			  clearInterval(interval);
			}
		
			return () => clearInterval(interval);
		  }, [isActive, seconds]);
		
		  const startTimer = (item: ContentItem, nums: number, setNum: number) => {
			let index = content.findIndex(rec => rec.name == item.name)
			if (index !== -1) {
				// 2. Update the checklist state
				const updatedListing = [...setList];
				const setKey = `set${setNum+1}`; // e.g., "set1"
				
				// Toggle to "check" when the timer starts
				updatedListing[index][setKey] = "check";
				setListing(updatedListing);
			}

			
			axios.patch(`${API_URL}/api/updatecheck?index=${index}&set=${setNum+1}`) 
			.catch(err => console.error(err));

			// setListing
			const num = nums
			if (num > 0) {
			  setSeconds(num);
			  setIsActive(true);
			}
		  };
		if (content.length == 0) return(
			<div className="col-span-full flex flex-col items-center justify-center text-black text-center py-20 text-2xl">
				<Loader2 className="h-10 w-10 text-gray-500 animate-spin mb-4" />
				<p className="[text-shadow:_1px_0_4px_rgb(255_255_255_/_0.8)]">Loading...</p>
			</div>
		)
	    return (
	        	//Home.tsx html code
			<div>

				<h1 className='text-black text-3xl'>
					{content?.[0]?.target.toUpperCase()}
				</h1>
				{content.map((item, i) => (
				<div key={i} className="max-w-4xl mx-auto my-10 bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
					{/* Container: Stacked by default, side-by-side on md screens */}
					<div className="md:flex">
						
						{/* Column 1: Image */}
						<div className="md:shrink-0">
						<img 
							className="h-48 w-full object-cover md:h-full md:w-48" 
							src={item.photo} 
							alt="Modern building architecture" 
						/>
						</div>

						{/* Column 2: Details */}
						<div className="p-8">
					
						<h1 className="block mt-1 text-lg leading-tight font-medium text-black hover:underline">
							{item.name}
							
						</h1>
						<table className="w-full text-left text-sm text-slate-500">
							
							<tbody>
							{/* Sets Equip */}
							<tr>
								<td className="px-4 py-3 font-medium text-slate-900">Equipment</td>
								<td className="px-4 py-3">{item.equipment}</td>
								<td className="px-4 py-3 text-right">—</td>
							</tr>
							{/* Sets Row */}
							<tr>
								<td className="px-4 py-3 font-medium text-slate-900">Sets</td>
								<td className="px-4 py-3">
									{[...Array(Number(item.sets))].map((_, index) => {
									// 1. Construct the key name (e.g., "set1", "set2")
									const setKey = `set${index + 1}`;
									let isPrevUnchecked = false;
									if (index > 0) {
										const prevSetKey = `set${index}`; // The key for the previous set
										const prevStatus = setList[i] && setList[i][prevSetKey];
										isPrevUnchecked = prevStatus !== "check"; 
									}
									
									// 2. Safely check if this specific set is marked as "check"
									// setList[i] matches the current exercise in the content.map loop
									const isChecked = setList[i] && setList[i][setKey] === "check";

									return (
										<input 
											key={index}
											type="checkbox"
											// 3. Link the checkbox visual state to your data
											checked={isChecked} 
											disabled={isActive || isChecked || isPrevUnchecked}
											// 4. Update the DB/State when clicked
											// onChange={() => handleToggleCheck(i, setKey)}
											onClick={() => startTimer(item, item.rest_time, index)}
											className="mr-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
										/>
									);
								})}
								</td>
								<td className="px-4 py-3 text-right space-x-1">
									<button onClick={() => AdjustSets(item, "inc")} className="px-2 py-0 bg-indigo-600 text-white rounded hover:bg-indigo-700">+</button>
									<button onClick={() => AdjustSets(item, "dec")} className="px-2 py-0 bg-indigo-600 text-white rounded hover:bg-indigo-700">-</button>
								</td>
							</tr>

							{/* Reps Row */}
							<tr>
								<td className="px-4 py-3 font-medium text-slate-900">Reps</td>
								<td className="px-4 py-3">{item.reps}</td>
								<td className="px-4 py-3 text-right space-x-1">
								<button onClick={() => AdjustReps(item, "inc")} className="px-2 py-0 bg-indigo-600 text-white rounded hover:bg-indigo-700">+</button>
								<button onClick={() => AdjustReps(item, "dec")} className="px-2 py-0 bg-indigo-600 text-white rounded hover:bg-indigo-700">-</button>
								</td>
							</tr>

							{/* Weight Row */}
							<tr>
								<td className="px-4 py-3 font-medium text-slate-900">Weight</td>
								<td className="px-4 py-3">{item.weight} kg</td>
								<td className="px-4 py-3 text-right space-x-1">
								<button onClick={() => AdjustWeight(item, "inc")} className="px-2 py-0 bg-indigo-600 text-white rounded hover:bg-indigo-700">+</button>
								<button onClick={() => AdjustWeight(item, "dec")} className="px-2 py-0 bg-indigo-600 text-white rounded hover:bg-indigo-700">-</button>
								</td>
							</tr>

							{/* Speed Row */}
							<tr>
								<td className="px-4 py-3 font-medium text-slate-900">Speed</td>
								<td className="px-4 py-3">{item.speed == 1 ? "Slow": item.speed == 2 ? "Normal":"Fast"}</td>
								<td className="px-4 py-3 text-right space-x-1">
								<button onClick={() => AdjustSpeed(item, "inc")} className="px-2 py-0 bg-indigo-600 text-white rounded hover:bg-indigo-700">+</button>
								<button onClick={() => AdjustSpeed(item, "dec")} className="px-2 py-0 bg-indigo-600 text-white rounded hover:bg-indigo-700">-</button>
								</td>
							</tr>

							<tr>
								<td className="px-4 py-3 font-medium text-slate-900">Drop Sets</td>
								<td className="px-4 py-3">{item.dropsets == 1 ? "Yes":"No"}</td>
								<td className="px-4 py-3 text-right space-x-1">
									<button onClick={() => isDropSet(item)} className="px-2 py-0 bg-indigo-600 text-white rounded hover:bg-indigo-700">~</button>
								</td>
							</tr>

							<tr>
								<td className="px-4 py-3 font-medium text-slate-900">Rest Time</td>
								<td className="px-4 py-3">{item.rest_time} secs</td>
								<td className="px-4 py-3 text-right space-x-1">
								<button onClick={() => AdjustRest(item, "inc")} className="px-2 py-0 bg-indigo-600 text-white rounded hover:bg-indigo-700">+</button>
								<button onClick={() => AdjustRest(item, "dec")} className="px-2 py-0 bg-indigo-600 text-white rounded hover:bg-indigo-700">-</button>
								</td>
							</tr>
							</tbody>
						</table>
						
					
						
						
						</div>

					</div>
					
				</div>
				 ))}
				 <button onClick={mNext} disabled={!canDone} className="mb-5 px-4 py-1 ml-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
					Done
				</button>

				<div className="fixed bottom-6 right-6 z-50 flex flex-col items-center p-2 bg-white rounded-2xl shadow-2xl border border-slate-200 w-52 transition-all animate-in fade-in slide-in-from-bottom-4">
      
					{/*NOTE: Timer Display */}
					<div className="text-4xl font-mono font-bold text-slate-800">
						{Math.floor(seconds / 60).toString().padStart(2, '0')}:
						{(seconds % 60).toString().padStart(2, '0')}
					</div>

					{!isActive && seconds === 0 ? (
						<div className="flex gap-2 w-full">
						{/* <input
							type="number"
							placeholder="Secs"
							className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							value={inputVal}
							onChange={(e) => setInputVal(e.target.value)}
						/> */}
						{/* <button 
							onClick={startTimer}
							className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
						>
							Go
						</button> */}
						</div>
					 ) 
					: (
						<button 
						onClick={() => {setIsActive(false); setSeconds(0);}}
						className="w-full bg-red-100 hover:bg-red-200 text-red-600 py-2 rounded-lg font-semibold transition"
						>
						Speed Up
						</button>
					)
					} 

					{/* Hidden Audio Element */}
					<audio ref={audioRef} src="alarm.mp3" />
				</div>
			</div>
	    
	
	    )
	}
	export default Home