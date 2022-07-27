import { useState, useEffect } from 'react'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '../utils/init-firebase'

function GetData(uid) {
  const [MsgArray, setMsgArray] = useState([])

  function FetchData() {
    const q = query(collection(db, "ConceptCollection"), where("To", "==", uid))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const cities = []
      querySnapshot.forEach((doc) => {
        cities.push(doc.data())
      })
      setMsgArray(cities)
    })
  }

  useEffect(() => {
    FetchData()
  }, [])
  return MsgArray
}

export { GetData }