"use client"
import React, { useEffect, useState} from 'react'
import moment from 'moment';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, { Draggable, DropArg } from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import { Button, Dialog, Transition, DialogPanel, DialogTitle} from '@headlessui/react'
import { CheckIcon, ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import { EventSourceInput } from '@fullcalendar/core/index.js'

interface Event  {
  id: number;
  title: string;
  description: string;
  start_time: Date | String;
  end_time: Date | String;
}
function index() {

  const [events, setEvents] = useState<Event[]>([])
  const [eventsID, setEventsID] = useState<number | null>(null)
  const [nuEvent, setNuEvent] = useState<Event>({
    id: 0,
    title: '',
    description: '',
    start_time: '',
    end_time: ''
  })
  const [isModalVisible, setModalVisible] = useState(false)
  const [isModalVisibleDelete, setModalVisibleDelete] = useState(false)
  
  const [isLoading, setLoading] = useState(true)
 
  useEffect(() => {
    fetch('http://localhost:3000/api/calendars')
      .then((res) => res.json())
      .then((data) => {
        setEvents(data.data)
        setLoading(false)
      })
  }, [])

  function handleDateClick(arg: { date: Date }) {
    setNuEvent({ 
      ...nuEvent, 
      start_time: arg.date, 
    })
    setModalVisible(true)
  }

  function handleDeleteModal(data: { event: { id: string } }) {
    setModalVisibleDelete(true)
    setEventsID(Number(data.event.id))
  }

  
  if (isLoading) return <p>Loading...</p>
  if (!events) return <p>No Event data</p>
 
  return (
    <>
      <nav className="flex justify-between mb-4 border-b border-violet-100 p-4">
        <h1 className="font-bold text-2xl text-gray-700">Calendar</h1>
      </nav>
      <main className="grid grid-cols-10 min-h-screen p-4 gap-4">
        {/* Sidebar */}
        <div className="col-span-3 bg-gray-100 p-4">
          <h2 className="text-xl font-bold mb-4">Sidebar</h2>
          <button className="bg-blue-500 text-white py-2 px-4 rounded mb-4">Button 1</button>
          <div className="mt-4">
            <h3 className="font-bold mb-2">Filter Users</h3>
            {/* Add your filter user component here */}
          </div>
        </div>
            <div className="col-span-7">
            <FullCalendar
              plugins={[
                dayGridPlugin,
                interactionPlugin,
                timeGridPlugin
              ]}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'resourceTimelineWook, dayGridMonth,timeGridWeek'
              }}
              events={events}
              nowIndicator={true}
              editable={false}
              droppable={false}
              selectable={false}
              selectMirror={true}
              dateClick={handleDateClick}
              eventClick={(data) => handleDeleteModal(data)}

            />
            </div>
      </main>
      <Dialog open={isModalVisible} as="div" className="relative z-10 focus:outline-none" onClose={close}>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <DialogTitle as="h3" className="text-base/7 font-medium text-white">
                Payment successful
              </DialogTitle>
              <p className="mt-2 text-sm/6 text-white/50">
                Your payment has been successfully submitted. We’ve sent you an email with all of the details of your
                order.
              </p>
              <div className="mt-4">
                <Button
                  className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                  onClick={()=>setModalVisible(!isModalVisible)}
                >
                  Got it, thanks!
                </Button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      <div>

    </div>
    </>
    
  )


}
   
export default index