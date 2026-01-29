'use client';
import { trpc } from "../trpc/client";

export default () =>{

  const { data } = trpc.todo.getAllTodos.useQuery();
  console.log(data);

  return <div>asd</div>
}