import React, { useEffect, useState} from 'react'
import moment from 'moment';

interface Event  {
  id: number;
  title: string;
  description: string;
  start_time: string;
}
function index() {

  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setLoading] = useState(true)
 
  useEffect(() => {
    fetch('http://localhost:3000/api/calendars')
      .then((res) => res.json())
      .then((data) => {
        setEvents(data.data)
        setLoading(false)
      })
  }, [])
 
  if (isLoading) return <p>Loading...</p>
  if (!events) return <p>No Event data</p>
 
  return (
    <div>
      {events.map(event=> 
        <div key={event.id}>
          <p>{event.title}</p>
          <p>{moment(event.start_time).format("LL")}</p>
          <p>{event.description}</p>
        </div>
      )}
    </div>
  )


}
   
export default index