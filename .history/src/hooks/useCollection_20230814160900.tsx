import React, { useEffect, useState } from "react";
import {
  onSnapshot,
  CollectionReference,
  DocumentData,
  Query,
  collection,
  query,
} from "firebase/firestore";
import { db } from "../firebase";

interface Channels {
  id: string;
  channel: DocumentData;
}
const useCollection = (data: string) => {
  const [documents, setDocuments] = useState<Channels[]>([]);

  // 타임스탬프 순서로 정렬하기 위한 쿼리 생성
  const collectionRef: Query<DocumentData> = query(
    collection(db, data),
    orderBy("timestamp")
  );
  useEffect(() => {
    onSnapshot(collectionRef, (querySnapshot) => {
      const channelsResults: Channels[] = [];
      querySnapshot.docs.forEach((doc) =>
        channelsResults.push({ id: doc.id, channel: doc.data() })
      );
      setDocuments(channelsResults);
    });
  }, []);
  return { documents };
};

export default useCollection;
