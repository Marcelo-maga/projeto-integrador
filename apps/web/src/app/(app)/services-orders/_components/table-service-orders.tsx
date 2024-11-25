"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "@nextui-org/react";

import { Printer, Check } from "lucide-react";
import CreateServiceOrderQuote from "./create-service-order-quote";
import UpdateServiceOrderModal from "./update-service-order-modal";
import DeleteServiceOrderModal from "./delete-service-order-modal";
import { useQuery } from "react-query";
import axios from "axios";

interface Orders {
  client_cpf_cnpj: string;
  type: string;
  description: string;
  material_value: number;
  labor_value: number;
  status: string;
  id: string;
}

const fetchOrders = async (): Promise<Orders[]> => {
  const response = await axios.get("http://localhost:4000/service-order");
  return response.data;
};

const formatedDate = (date: string | null) => {
  if (!date) return "N/A";

  return date.split("T")[0].split("-").reverse().join("/");
};

export default function TableServiceOrders() {
  const {
    data: orders,
    isLoading,
    isError,
  } = useQuery("serviceOrders", fetchOrders);

  if (isLoading) return <p>Carregando...</p>;
  if (isError) return <p>Ocorreu um erro ao buscar os dados.</p>;

  return (
    <Table aria-label="Example static collection table">
      <TableHeader>
        <TableColumn>Nome</TableColumn>
        <TableColumn>Email</TableColumn>
        <TableColumn>CPF/CNPJ</TableColumn>
        <TableColumn>Tipo de Serviço</TableColumn>
        <TableColumn>Descrição</TableColumn>
        <TableColumn>Valor do Material</TableColumn>
        <TableColumn>Valor da Mão de Obra</TableColumn>
        <TableColumn>Data Inicial</TableColumn>
        <TableColumn>Data Estimada</TableColumn>
        <TableColumn>Status</TableColumn>
        <TableColumn>Ações</TableColumn>
      </TableHeader>
      <TableBody>
        {orders ? (
          orders.map((item: any) => {
            const serviceOrderQuote = {
              id: item.id,
              clientName: item.client_name,
              cpfCnpj: item.client_cpf_cnpj,
              email: item.client_email,
              labor_value: item.labor_value,
              material_value: item.material_value,
              whole_value:
                Number(item.material_value) + Number(item.labor_value),
            };

            return (
              <TableRow key={item.client_cpf_cnpj}>
                <TableCell>{item.client_name}</TableCell>
                <TableCell>{item.client_email}</TableCell>
                <TableCell>{item.client_cpf_cnpj}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.material_value}</TableCell>
                <TableCell>{item.labor_value}</TableCell>
                <TableCell>{formatedDate(item.initial_date)}</TableCell>
                <TableCell>{formatedDate(item.estimated_date)}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell className="flex gap-2">
                  {/* <Printer className="w-7 h-7" stroke="white" /> */}
                  <CreateServiceOrderQuote
                    ServiceOrderQuote={serviceOrderQuote}
                  />
                  <UpdateServiceOrderModal content={[item]} id={item.id} />
                  <DeleteServiceOrderModal id={item.id} />
                  <Button className="bg-transparent px-0 mx-0 w-10 min-w-0">
                    <div className="flex p-1 rounded-full bg-green-500  shadow-green-500 shadow-md cursor-pointer">
                      <Check className="w-7 h-7" stroke="white" />
                    </div>
                  </Button>
                </TableCell>
              </TableRow>
            );
          })
        ) : (
          <></>
        )}
      </TableBody>
    </Table>
  );
}
