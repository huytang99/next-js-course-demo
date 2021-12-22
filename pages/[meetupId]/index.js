//Đây là file chi tiết mỗi meetup bởi id riêng biết dc thêm vào từ meetupItem
import { MongoClient, ObjectId } from 'mongodb'
import Head from 'next/head'
import { Fragment } from 'react'

import MeetupDetail from "../../components/meetups/MeetupDetail";

function MeetupDetails(props) {
  return (
    <Fragment>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description}></meta>
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </Fragment>
  );
}

export async function getStaticPaths() {//cái này có nhiệm vụ khi mà mìn dùng useStaticProps trong page component nhưng dynamic url để nói cho
                                      // máy biết rằng có bao nhiêu url mà user nhập vào sẽ dc prerender vì nếu k khai báo thì sao máy biết =)) 
                                      //Trong paths mình sẽ khai báo hết tất cả dynamic Id mình có, còn fallback nếu set là false có nghĩa
                                      //là mình đã khai báo hết url nếu có nhập cái gì k có trong paths thì sẽ ra 404, còn nếu set nó = true 
                                      // thì kể cả có nhập thêm url k có trong paths thì nó cũng sẽ ra 1 trang nào đó cụ thể
  //Lấy về tất cả id từ mỗi document để bỏ vào params của paths
  const client = await MongoClient.connect('mongodb+srv://huythetang99:21121999Huy@cluster0.odti0.mongodb.net/meetups?retryWrites=true&w=majority')
  
  const db =client.db()//get hold of the db

  const meetupsCollection = db.collection('meetups')//a collection multiple documents(meetup) with name 'meetups'

  const meetups = await meetupsCollection.find({}, {_id: 1}).toArray()//có nghĩa là mình chỉ muốn mỗi document chỉ lấy mỗi id

  client.close()
  return {
    fallback: blocking,//or true sẽ k trả về 404 mà khi cần nó sẽ tự tạo luôn trang
    paths: meetups.map(meetup => ({
      params: {meetupId: meetup._id.toString()}//convert th id của db về dạng chuỗi để giống với id trên url khi bấm vào 1 meetup
    }))
    // paths: [
    //   {
    //     params: {
    //       meetupId: 'm1',
    //     },
    //   },
    //   {
    //     params: {
    //       meetupId: 'm2',
    //     },
    //   },
    // ],
  };
}

export async function getStaticProps(context) {
  //fetch data for a single meetup

  const meetupId = context.params.meetupId;//nếu là function component ở trên thì mình có thể dùng useRouter nhưng ở đây thì k
  console.log(meetupId);

  const client = await MongoClient.connect('mongodb+srv://huythetang99:21121999Huy@cluster0.odti0.mongodb.net/meetups?retryWrites=true&w=majority')
  
  const db =client.db()//get hold of the db

  const meetupsCollection = db.collection('meetups')//a collection multiple documents(meetup) with name 'meetups'

  const selectedMeetup = await meetupsCollection.findOne({_id: ObjectId(meetupId)})
  //chỉ tìm ra th nào có id cùng với id mình lấy trên cùng trong đám document
  //Mình phải convert th id này ra thành ObjectId để tìm kiếm thì mới có vì trên db lưu id như v

  client.close()
  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
        description: selectedMeetup.description
      }
    },
  };
}

export default MeetupDetails;
