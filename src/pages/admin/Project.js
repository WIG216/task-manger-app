import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Spinner,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  Input,
  FormLabel,
  Select,
  useToast,
  Textarea,
  
} from "@chakra-ui/react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { FaClock, FaEllipsisH, FaPlus } from "react-icons/fa";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import moment from "moment";
import EditableWithControls from "components/EditableWithControls";
import { database } from "config/firebase-config";
import useAuth from "hook/useAuth";
import { ref, onValue, push, update, set } from 'firebase/database';

import Button from "components/Base/Button";

export default function Project() {
  const navigate = useNavigate()
  const location = useLocation();
  const { projectId } = useParams();

  const toast = useToast();
  const [user, authLoading] = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("");
  const [rows, setRows] = useState([]);
  const [row_data, setRow_data] = useState([]);
  const [tasks, setTasks] = useState({});
  const [projectRef, setProjectRef] = useState("");
  const {
    isOpen: isOpenCreateTask,
    onOpen: onOpenCreateTask,
    onClose: onCloseCreateTask
  } = useDisclosure();
  const {
    isOpen: isOpenTaskModal,
    onOpen: onOpenTaskModal,
    onClose: onCloseTaskModal
  } = useDisclosure();
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskRow, setNewTaskRow] = useState("");
  const [isLoadingNewTask, setIsLoadingNewTask] = useState(false);
  const [isLoadingNewRow, setIsLoadingNewRow] = useState(false);
  const [currentTask, setCurrentTask] = useState({});
  const [isCurrentTaskSaved, setIsCurrentTaskSaved] = useState(false);
  const [isCurrentTaskSaving, setIsCurrentTaskSaving] = useState(false);

  const setProjectData = (proj) => {
    setName(proj.name);
    setTasks(proj.tasks || {});
    setRow_data(proj.row_data || []);
    setRows(proj.rows || []);
  };

  useEffect(() => {
    if (!projectId) {
      navigate("/profile");
      return;
    }

    if (!user) return;

    if (location.state && location.state.project) {
      const proj = location.state.project;
      setProjectData(proj);
      setIsLoading(false);
    }

    const projectRef = ref(database, `${user.uid}/projects/${projectId}`);
    const dbSubscription = onValue(projectRef, (snapshot) => {
      if (!snapshot) return;
      if (!snapshot.exists()) {
        navigate("/profile");
        return;
      }
      setProjectData(snapshot.val());
      if (isLoading) {
        setIsLoading(false);
        setProjectRef(`${user.uid}/projects/${projectId}`);
      }
    });

    return () => {
      dbSubscription(); 
    };
  }, [user, projectId]);

  const createNewTask = async () => {
    setIsLoadingNewTask(true);
    try {
      const newTaskRef = push(ref(database, `${projectRef}/tasks/`), {
        name: newTaskName,
        created_at: Date.now(),
        updated_at: Date.now(),
        content: "",
        tag: "new"
      });

      const newRowDataUpdate = { ...row_data };
      const newTaskKey = newTaskRef.key;

      if (newRowDataUpdate[newTaskRow] && newRowDataUpdate[newTaskRow].tasks) {
        newRowDataUpdate[newTaskRow].tasks.push(newTaskKey);
      } else {
        newRowDataUpdate[newTaskRow].tasks = [newTaskKey];
      }

      await update(ref(database, `${projectRef}/row_data`), newRowDataUpdate);

      setNewTaskName("");
      setNewTaskRow("");
      toast({
        title: "Project created",
        description: "Your project has been created.",
        status: "success",
        duration: 5000,
        isClosable: true
      });
      onCloseCreateTask();
    } catch (e) {
      console.log(e);
      toast({
        title: "Task not created",
        description: "An error occurred while creating the task.",
        status: "error",
        duration: 5000,
        isClosable: true
      });
    }
    setIsLoadingNewTask(false);
  };

  const createNewRow = async () => {
    try {
      setIsLoadingNewRow(true);
      const newRowRef = push(ref(database, `${projectRef}/row_data`), { name: "New Row", tasks: [] });
      const newRowKey = newRowRef.key;

      const newRowDataUpdate = [...rows, newRowKey];
      await set(ref(database, `${projectRef}/rows`), newRowDataUpdate);

      setIsLoadingNewRow(false);
      toast({
        title: "New row created",
        description: "New row has been created.",
        status: "success",
        duration: 5000,
        isClosable: true
      });
    } catch (e) {
      toast({
        title: "New row not created",
        description: "An error occurred while creating the new row.",
        status: "error",
        duration: 5000,
        isClosable: true
      });
    }
  };

  const saveCurrentTask = async () => {
    setIsCurrentTaskSaving(true);
    await update(ref(database, `${projectRef}/tasks/${currentTask.key}/`), {
      ...currentTask,
      key: "",
      updated_at: Date.now()
    });
    setCurrentTask({ ...currentTask, updated_at: Date.now() });
    setIsCurrentTaskSaved(true);
    setIsCurrentTaskSaving(false);
  };

  const createTaskModal = () => (
    <Modal isOpen={isOpenCreateTask} onClose={onCloseCreateTask}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Task</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl id="newTaskName">
            <FormLabel>Task name</FormLabel>
            <Input
              placeholder="Write more buggy code"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
            />
          </FormControl>
          <FormControl id="newTaskRow" mt="3">
            <FormLabel>Where to add</FormLabel>
            <Select
              placeholder="Select row..."
              value={newTaskRow}
              onChange={(e) => setNewTaskRow(e.target.value)}
            >
              {rows.map((rowId) => {
                const row = row_data[rowId];
                return (
                  <option value={rowId} key={rowId}>
                    {row.name}
                  </option>
                );
              })}
            </Select>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="ghost"
            mr={3}
            disabled={isLoadingNewTask}
            onClick={onCloseCreateTask}
          >
            Close
          </Button>
          <Button
            colorScheme="blue"
            isLoading={isLoadingNewTask}
            disabled={isLoadingNewTask || !newTaskName || !newTaskRow}
            onClick={createNewTask}
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  
 
  const onDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (destination.droppableId === "rows") {
      let newRows = [...rows];
      newRows.splice(destination.index, 0, newRows.splice(source.index, 1)[0]);
      setRows(newRows);
      set(ref(database, `${projectRef}/rows`), newRows);    }

    if (destination.droppableId.includes(".tasks")) {
      const destinationId = destination.droppableId.replace(".tasks", "");
      const sourceId = source.droppableId.replace(".tasks", "");
      let newRowData = { ...row_data };
      if (newRowData[destinationId].tasks) {
        newRowData[destinationId].tasks.splice(
          destination.index,
          0,
          newRowData[sourceId].tasks.splice(source.index, 1)[0]
        );
      } else {
        const oldElm = newRowData[sourceId].tasks.splice(source.index, 1)[0];
        newRowData[destinationId].tasks = [oldElm];
      }
      setRow_data(newRowData);
      update(ref(database, `${projectRef}/row_data`), newRowData)
    }
  };
  
  const taskModal = () => {
    const updated_at = moment(currentTask.updated_at);
    const created_at = moment(currentTask.created_at);

    return (
      <Modal isOpen={isOpenTaskModal} onClose={onCloseTaskModal} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <EditableWithControls
              flex="1"
              value={currentTask.name}
              onChange={async (val) => {
                console.log(val)
                const taskRef = ref(database, `${projectRef}/tasks/${currentTask.key}`);
                await update(taskRef, { name: val, updated_at: Date.now() });
                setCurrentTask({ ...currentTask, updated_at: Date.now() });
              }}
            />

            <FormControl id="newTaskRow" mt="3">
              <Textarea
                height="400px"
                placeholder="About this task..."
                value={currentTask.content}
                onChange={(e) => {
                  setCurrentTask({ ...currentTask, content: e.target.value });
                  setIsCurrentTaskSaved(false);
                }}
              >
                {currentTask.content}
              </Textarea>
            </FormControl>

            <Flex align="center" mt="5">
              <Text color="gray.500">Created {created_at.fromNow()}</Text>
              <Text color="gray.500" ml="auto">
                Updated {updated_at.fromNow()}
              </Text>
            </Flex>
          </ModalBody>

          {!isCurrentTaskSaved && (
            <ModalFooter>
              <Button
                colorScheme="blue"
                isLoading={isCurrentTaskSaving}
                onClick={saveCurrentTask}
              >
                Save
              </Button>
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
    );
  };

  if (authLoading) {
    return (
      <Flex minH="100vh" bgColor="blue.50" pt="20" px="4" direction="column">
        <Spinner mx="auto" mt="24" />
      </Flex>
    );
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  if (isLoading) {
    return (
      <Flex minH="100vh" bgColor="blue.50" pt="20" px="4" direction="column">
        <Spinner mx="auto" mt="24" />
      </Flex>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
    <Flex h={{
          sm: "initial",
          md: "unset",
          lg: "100vh",
          xl: "97vh",
        }}
        w='100%'
        pt={{ sm: "50px", md: "0px" }}
        px={{ lg: "30px", xl: "0px" }}
        justifyContent='start'
        direction='column'>
      <Flex align="space-between">
        <EditableWithControls
          mx="4"
          flex="1"
          value={name}
          onChange={async (val) => {
            await update(ref(database, `${projectRef}`), { name: val });
          }}
        />
        
        <Button  mr="4" onClick={onOpenCreateTask}>
          <FaPlus />
          <Text ml="2">Add task</Text>
        </Button>
        <Button
            
            mr="4"
            isLoading={isLoadingNewRow}
            onClick={createNewRow}
          >
            <FaPlus />
            <Text ml="2">Add Row</Text>
          </Button>
      </Flex>

      {createTaskModal()}
      {taskModal()}

      <Droppable droppableId="rows" direction="horizontal" type="column">
        {(sectionWrapperProvided) => (
          <Flex
            flex="1"
            mt="5"
            width="100vw"
            overflow="scroll"
            align="strech"
            {...sectionWrapperProvided.droppableProps}
            ref={sectionWrapperProvided.innerRef}
          >
            {rows &&
              rows.map((rowId, rowIndex) => {
                const row = row_data[rowId];

                return (
                  <Draggable draggableId={rowId} index={rowIndex} key={rowId}>
                    {(sectionDraggableProvided, snapshot) => (
                      <Flex
                        width="25%"
                        minWidth="300px"
                        h="70vh"
                        px="5"
                        direction="column"
                        mx='1rem'
                        align="stretch"
                        rounded="lg"
                        bgColor={snapshot.isDragging ? "blue.100" : "blue.50"}
                        border={
                          snapshot.isDragging ? "1px solid blue.100" : ""
                        }
                        {...sectionDraggableProvided.draggableProps}
                        ref={sectionDraggableProvided.innerRef}
                        isDragging={snapshot.isDragging}
                      >
                        <Flex align="center" w="100%" mt="1">
                          <EditableWithControls
                            flex="1"
                            value={row.name}
                            onChange={async (val) => {
                              console.log(val)
                              await update(ref(database, `${projectRef}/row_data/${rowId}`), { name: val });
                            }}
                          />
                          <Box
                            ml="3"
                            color="gray.400"
                            p="2"
                            cursor="move"
                            children={<FaEllipsisH />}
                            {...sectionDraggableProvided.dragHandleProps}
                          />
                        </Flex>

                        <Droppable
                          droppableId={`${rowId}.tasks`}
                          direction="vertical"
                          type="row"
                        >
                          {(tasksDroppableProvided) => (
                            <Flex
                              {...tasksDroppableProvided.droppableProps}
                              ref={tasksDroppableProvided.innerRef}
                              width="100%"
                              direction="column"
                              flex="1"
                            >
                              {row.tasks &&
                                row.tasks.map((taskId, taskIndex) => {
                                  const task = tasks[taskId];
                                  const updated_at = moment(task.updated_at);

                                  return (
                                    <Draggable
                                      draggableId={taskId}
                                      index={taskIndex}
                                      key={taskId}
                                    >
                                      {(rowDraggableProvided, snapshot) => (
                                        <Flex
                                          mt="4"
                                          px="4"
                                          py="3"
                                          rounded="md"
                                          bgColor="white"
                                          shadow="sm"
                                          userSelect="none"
                                          direction="column"
                                          {...rowDraggableProvided.draggableProps}
                                          {...rowDraggableProvided.dragHandleProps}
                                          ref={rowDraggableProvided.innerRef}
                                          isDragging={snapshot.isDragging}
                                          onClick={() => {
                                            setCurrentTask({
                                              key: taskId,
                                              ...task
                                            });
                                            setIsCurrentTaskSaved(true);
                                            onOpenTaskModal();
                                          }}
                                        >
                                          <Text>{task.name}</Text>
                                          <Flex align="center" mt="2">
                                            <Flex
                                              color="gray.400"
                                              align="center"
                                            >
                                              <FaClock />
                                              <Text ml="1">
                                                {updated_at.fromNow()}
                                              </Text>
                                            </Flex>
                                          </Flex>
                                        </Flex>
                                      )}
                                    </Draggable>
                                  );
                                })}

                              {tasksDroppableProvided.placeholder}
                            </Flex>
                          )}
                        </Droppable>
                      </Flex>
                    )}
                  </Draggable>
                );
              })}

            {sectionWrapperProvided.placeholder}
          </Flex>
        )}
      </Droppable>
    </Flex>
  </DragDropContext>
  );
}
