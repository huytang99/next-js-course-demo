//our-domain.com/new-meetup
import Head from 'next/head'
import { Fragment } from 'react'
import { useRouter } from 'next/router'
import NewMeetupForm from '../components/meetups/NewMeetupForm'

function NewMeetupPage() {
    const router = useRouter()

    async function addMeetupHandler(enteredMeetupData) {
        console.log(enteredMeetupData)
        const response = await fetch('/api/new-meetup', {//gọi cái api mình viết để post form data lên db
            method: 'POST',
            body: JSON.stringify(enteredMeetupData),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const data = await response.json()
        console.log(data)

        router.push('/')//về lại trang gốc
    }

    return (
        <Fragment>
            <Head>
                <title>Add a New Meetup</title>
                <meta name="description" content="Add your own meetups and create amazing networking opportunities"></meta>
            </Head>
            <NewMeetupForm onAddMeetup={addMeetupHandler}></NewMeetupForm>
        </Fragment>
    )
}

export default NewMeetupPage;