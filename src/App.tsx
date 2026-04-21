import { BrowserRouter, Routes, Route } from 'react-router-dom'
	import { About, Contact, Home, Pricing, Listing } from './components/pages'
	// import { Navbar } from './components/navbar'

	function App() {
	    return (
	       <main>
            <BrowserRouter>
                {/* <Navbar/> */}
                <div className='bg-white h-auto w-full flex items-center justify-center'>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/pest' element={<Listing />} />
                    <Route path='/about' element={<About />} />
                    <Route path='/pricing' element={<Pricing />} />
                    <Route path='/contact' element={<Contact />} />
                </Routes>
                </div>
            </BrowserRouter>
        </main>
	    )
	}
	export default App