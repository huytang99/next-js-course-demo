// /api/new-meetup
//Đây là 1 api route để insert meetup vô database, thứ mà mình sẽ dùng để đẩy form data vào
import { MongoClient } from 'mongodb'

async function handler(req, res) {//chỉ chạy trên server side nên k ssợ lộ credentials
    if (req.method === 'POST') {
        const data = req.body;

        // const { title, image, address, description} = data

        const client = await MongoClient.connect('mongodb+srv://huythetang99:21121999Huy@cluster0.odti0.mongodb.net/meetups?retryWrites=true&w=majority')
        //thay <password> = pass user trong connect và thay firstdatabase thành tên mong muốn
        const db =client.db()//get hold of the db

        const meetupsCollection = db.collection('meetups')//a collection multiple documents(meetup) with name 'meetups'
        
        const result = await meetupsCollection.insertOne(data)
        
        client.close()

        res.status(201).json({message: 'Meetup inserted!'})
    }
}

export default handler