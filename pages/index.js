//our-domain.com/
import Head from 'next/head'
import { MongoClient} from 'mongodb'
import { Fragment } from 'react'

import { useEffect, useState } from 'react'
import MeetupList from '../components/meetups/MeetupList'


// const DUMMY_MEETUPS = [
//     { 
//         id: 'm1', 
//         title: 'A First Meetup', 
//         image: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Stadtbild_M%C3%BCnchen.jpg',
//         address:'Some address, Some City',
//         description: 'This is a first meetup!'
//     },
//     { 
//         id: 'm2', 
//         title: 'A Second Meetup', 
//         image: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Stadtbild_M%C3%BCnchen.jpg',
//         address:'Some address, Some City',
//         description: 'This is a second meetup!'
//     },
    
// ]

function HomePage (props) {
    // const [loadedMeetups, setLoadedMeetups] = useState([])

    // useEffect(()=>{//dùng thì ok nhưng mà vì nó chỉ nhận dc data ở trước lần render thứ 2 nên snapshot đầu tiên là trống => k thỏa mãn dc
    //             //mục đích ban đầu sử dụng nextjs thay vi react
        
    //     //send a http request to fetch meetupData
    //     setLoadedMeetups(DUMMY_MEETUPS)
    // },[])
    return (
        // <MeetupList meetups={loadedMeetups}/>
        <Fragment>
            <Head>
                <title>React Meetups</title>
                <meta name="description" content="Browse a huge list of highly active React meetups"></meta>
            </Head>
            <MeetupList meetups={props.meetups}/>
        </Fragment>

       
    )
}

// export async function getServerSideProps(context) {//nó dc chạy trên server sau deployment process và nó đảm bảo build lại trang mỗi khi có request mới
//                                                     //nên dùng thay cho cái static trừ khi mà có request liên tục kiểu vài s 1 lần
//     const req = context.req                         //hoặc là chỉ dùng khi mình cần access vô cái incoming request response như bên trái
//     const res = context.res
    
//     //fetch data from an API: chạy trên server

//     return {
//         props: {
//             meetups: DUMMY_MEETUPS
//         }
//     }
// }

export async function getStaticProps() {//đây là code executed trong build process và ở server, nhiệm vụ của nó là load trước
                                    //async data như là trả về 1 cái promise từ việc fetch để ngay tức khi render lần đầu tiên là đã có 
                                    //data để tránh việc server trả về 1 html trống cho data gây hại cho SEO
                                    //nó có thể chỉ chạy 1 lần hoặc thỉnh thoảng build lại trang khi dùng revalidate
    // fetch data from an API server: chạy trên server
    const client = await MongoClient.connect('mongodb+srv://huythetang99:21121999Huy@cluster0.odti0.mongodb.net/meetups?retryWrites=true&w=majority')
    //thay <password> = pass user trong connect và thay firstdatabase thành tên mong muốn
    const db =client.db()//get hold of the db

    const meetupsCollection = db.collection('meetups')//a collection multiple documents(meetup) with name 'meetups'

    const meetups = await meetupsCollection.find().toArray()//nó sẽ trả về tất cả document trong collection và bỏ vào 1 cái array

    client.close()

    return {
        props: {
            meetups: meetups.map(meetup => ({//làm bước này là vì mỗi cái meetup document nó có 1 cái id mà có dạng phải đổi về string
                title: meetup.title,
                address: meetup.address,
                image: meetup.image,
                description: meetup.description,
                id: meetup._id.toString()//đổi id do mongodb tạo về string
            }))
        },
        revalidate: 1//nếu k dùng cái này thì nếu data mới thêm vào thì lúc nào data của mình cũng sẽ bị outdated,
                    //nếu như là blog nhỏ ít thay đổi thì chỉ cần build r deploy lại nhưng dự án lớn thì dùng dòng này để đảm bảo rằng
                    //là ít nhất cứ mỗi 10s nếu có request đang chạy thì nó sẽ regenerate lại trang để lấy data mới
    }//luôn trả về 1 object với cùng định dạng
} //chỉ chạy trong page component file

export default HomePage