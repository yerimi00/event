import { useState } from 'react'
import Page1 from './components/Page1'
import Page2 from './components/Page2'
import TextPage from './components/TextPage'
import ImagePage from './components/ImagePage'
import Page3 from './components/Page3'
import Page4 from './components/Page4'

import img3 from './assets/3.jpg'
import img2 from './assets/2.jpg'
import img1 from './assets/1.jpg'
import img0 from './assets/0.jpg'

const TOTAL = 10

function App() {
  const [page, setPage] = useState(1)
  const next = () => setPage(p => Math.min(p + 1, TOTAL))
  const prev = () => setPage(p => Math.max(p - 1, 1))

  return (
    <div>
      {page === 1  && <Page1 onNext={next} />}
      {page === 2  && <Page2 onNext={next} onPrev={prev} />}
      {page === 3  && <TextPage text="사실 심심해서 이거 만들었어." onNext={next} onPrev={prev} />}
      {page === 4  && <TextPage text="머냐면 ...." onNext={next} onPrev={prev} />}
      {page === 5  && <ImagePage src={img3} label="3" onNext={next} onPrev={prev} />}
      {page === 6  && <ImagePage src={img2} label="2" onNext={next} onPrev={prev} />}
      {page === 7  && <ImagePage src={img1} label="1" onNext={next} onPrev={prev} />}
      {page === 8  && <ImagePage src={img0} label="0" onNext={next} onPrev={prev} />}
      {page === 9  && <Page3 onNext={next} onPrev={prev} />}
      {page === 10 && <Page4 onPrev={prev} />}
    </div>
  )
}

export default App
