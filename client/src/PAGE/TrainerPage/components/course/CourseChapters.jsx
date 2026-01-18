import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Chapter from './Chapter.jsx'
import EditChapterModal from '../UI/modal/EditChapterModal.jsx';
import { API_URL } from '../../../../api.js';
import DeleteContent from '../UI/DeleteContent.jsx';

export default function CourseChapters(props) {
  const [isEditChapter, setEditChapter] = useState(false);
  const [isEditChapterModal, setIsEditChapterModal ] = useState(false)
  const [EditChapterData, setEditChapterData] = useState({chapterId:"", chapter_index: "", chapter_title:"", chapter_description: ""})
  const [fetchChapters, setFetchChapters] = useState([]);
  const [activeChapterId, setActiveChapterId] = useState(null);
  
  const [refresh, setRefresh]= useState(0);

  function handleRefresh(index){
    setRefresh(prev => prev + 1)
      
  }

  
  useEffect(() => {
    const fetchingChapters = async () => {
      try {
        const [chapterInfo, chapterItems] = await Promise.all([
          axios.get(`${API_URL}/trainer/course/${props.courseId}`, { withCredentials: true }),// this to fetch all the chapters
          axios.get(`${API_URL}/trainer/course/1/${props.courseId}`, { withCredentials: true })
        ]);
        console.log(chapterInfo.data)
        const chapterId = chapterItems.data.chapterInfo[0].id
        const chapterIndex = chapterItems.data.chapterInfo[0].order_index
        props.handleChaptersInfo(chapterId, chapterIndex) 
        const fetchedChapters = chapterInfo.data.data;
        
        setFetchChapters(fetchedChapters);

        if (fetchedChapters && fetchedChapters.length > 0) {
          const firstChapter = fetchedChapters.reduce((prev, curr) =>
            curr.order_index < prev.order_index ? curr : prev
          );
          setActiveChapterId(firstChapter.id);
        }
      } catch (error) {
        console.error(error);
      }
    };
    
    fetchingChapters();
  }, [refresh , props.refresh]);


  // Functions
 

  async function handleShowChapter(id, chapter_index) {
    
    props.handleChaptersInfo(id, chapter_index, isEditChapter)
    try {
      const result = await axios.get(`${API_URL}/trainer/course/${chapter_index}/${props.courseId}`, { withCredentials: true })    
    } catch (error) {
      console.log(error);
    }
  }

  const handleActiveChapter = (chapterId) => {
    setActiveChapterId(chapterId);
  };

  function handleShowEditChapterModal(chapterId, chapter_index, chapter_title, chapter_description ){
    setIsEditChapterModal(true)
    console.log(chapterId, chapter_index, chapter_title, chapter_description)
    setEditChapterData({chapterId:chapterId, chapter_index: chapter_index, chapter_title:chapter_title, chapter_description: chapter_description})
      
  }
  function handleExitEditChapterModal(){
    setIsEditChapterModal(false)
    setRefresh(prev => prev + 1)
  }
    

  const handleDragEnd = async (result) => {
      const { source, destination } = result;

      if (!destination) return; // dropped outside

      // Copy chapter array
      const items = Array.from(fetchChapters);

      // Remove the dragged item
      const [reorderedItem] = items.splice(source.index, 1);

      // Insert it at new position
      items.splice(destination.index, 0, reorderedItem);

      // Update local state
      setFetchChapters(items);

      // Prepare data for backend
      const orderedChapters = items.map((item, index) => ({
        id: item.id,
        order_index: index + 1, // or whatever your indexing is
      }));
      
      try {
        await axios.put(`${API_URL}/trainer/chapter/reorder`, { orderedChapters });
        console.log('Chapter order saved!');
        setRefresh(prev => prev + 1)
      } catch (err) {
        console.error('Failed to save chapter order', err);
      }
    };
    
    
  return (
    
      <div className="ml-auto h-full w-full bg-white overflow-y-scroll relative shadow-lg">
            

            <div className="h-10 w-full bg-gray-200 flex items-center sticky top-0">  {/*course content header*/}
              <h1 className="text-large ml-3 font-bold ">Course content</h1>
              <button
                onClick={()=>{setEditChapter(!isEditChapter), props.handleEditChapter(isEditChapter)}}
                className='m-3 ml-auto'
              ><MoreHorizIcon  />
              </button>
            </div>
            
            {isEditChapter
            ?<div>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="chapterList">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {fetchChapters.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={String(item.id)}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`${snapshot.isDragging ? "bg-green-300" : ""}`}
                          >
                            <Chapter
                              id={item.id}
                              orderIndex={item.order_index}
                              title={item.title}
                              chapter_no={item.order_index}
                              description={item.description}
                              handleOpenChapter={handleShowChapter}
                              handleActiveChapter={()=>setActiveChapterId(item.id)}
                              handleShowEditChapterModal={handleShowEditChapterModal}
                              onRefresh={handleRefresh}
                              isEditChapter={isEditChapter}
                              isActive={activeChapterId === item.id } 
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            </div>
            :<div>
              {fetchChapters.map((item, index) => (
              
                <Chapter
                 key={item.id}
                  id={item.id}
                  title={item.title}
                  chapter_no={item.order_index}
                  description={item.description}
                  handleOpenChapter={handleShowChapter }
                  handleActiveChapter={handleActiveChapter}
                  isEditChapter={isEditChapter}
                  isActive={activeChapterId === item.id} 
                />
              
              ))
              }
            </div>}
            <div className=''>
               {isEditChapterModal? <EditChapterModal chapterData={EditChapterData} courseId={props.courseId} onExit={handleExitEditChapterModal} />: null}
            </div>
        </div>
        
   
  )
}
