import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Layout,
  LayoutBody,
  LayoutHeader,
} from '@/components/custom/layout';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import ThemeSwitch from '@/components/theme-switch';
import { Breadcrumb, BreadcrumbItem } from '@/components/custom/breadcrumb';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { IconEdit, IconTrash } from '@tabler/icons-react';

interface ProbabilitasType {
  id: number;
  kode_kerusakan: string;
  probabilitas: string;
}

export default function Probabilitas() {
  const [probabilitasList, setProbabilitasList] = useState<ProbabilitasType[]>([]);
  const [filteredProbabilitas, setFilteredProbabilitas] = useState<ProbabilitasType[]>([]);
  const [sortOrder, setSortOrder] = useState('ascending');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProbabilitas, setEditingProbabilitas] = useState<ProbabilitasType | null>(null);
  const [newKodeKerusakan, setNewKodeKerusakan] = useState('');
  const [newProbabilitas, setNewProbabilitas] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://sistempakar-backendapp-ce3dc310e112.herokuapp.com/admin/probability');
      setProbabilitasList(response.data || []);
    } catch (error) {
      console.error('Error fetching data:', (error as Error).message);
    }
  };

  const filterAndSortProbabilitas = useCallback(() => {
    let filtered = [...probabilitasList];

    if (searchTerm) {
      filtered = filtered.filter(probabilitas =>
        probabilitas.probabilitas.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      if (a.kode_kerusakan && b.kode_kerusakan) {
        return sortOrder === 'ascending' ? a.kode_kerusakan.localeCompare(b.kode_kerusakan) : b.kode_kerusakan.localeCompare(a.kode_kerusakan);
      } else {
        return 0;
      }
    });

    setFilteredProbabilitas(sorted);
  }, [probabilitasList, searchTerm, sortOrder]);

  useEffect(() => {
    filterAndSortProbabilitas();
  }, [probabilitasList, searchTerm, sortOrder, filterAndSortProbabilitas]);

  const handleDeleteProbabilitas = async (id: number) => {
    try {
      await axios.delete(`https://sistempakar-backendapp-ce3dc310e112.herokuapp.com/admin/probability/${id}`);
      setProbabilitasList(probabilitasList.filter(probabilitas => probabilitas.id !== id));
      filterAndSortProbabilitas();
      toast.success('Probabilitas berhasil dihapus.');
    } catch (error) {
      console.error('Error deleting probabilitas:', (error as Error).message);
      toast.error('Terjadi kesalahan saat menghapus probabilitas.');
    }
  };

  const handleEditProbabilitas = async () => {
    if (!editingProbabilitas) return;

    try {
      const response = await axios.put(`https://sistempakar-backendapp-ce3dc310e112.herokuapp.com/admin/probability/${editingProbabilitas.id}`, {
        kode_kerusakan: editingProbabilitas.kode_kerusakan,
        probabilitas: editingProbabilitas.probabilitas,
      });
      const updatedProbabilitasList = probabilitasList.map(probabilitas => (probabilitas.id === response.data.id ? response.data : probabilitas));
      setProbabilitasList(updatedProbabilitasList);
      setEditingProbabilitas(null);
      fetchData();
      toast.success('Probabilitas berhasil diubah.');
    } catch (error) {
      console.error('Error editing probabilitas:', (error as Error).message);
      toast.error('Terjadi kesalahan saat mengubah probabilitas.');
    }
  };

  const handleAddProbabilitas = async () => {
    try {
      const response = await axios.post('https://sistempakar-backendapp-ce3dc310e112.herokuapp.com/admin/probability', {
        kode_kerusakan: newKodeKerusakan,
        probabilitas: newProbabilitas,
      });
      const updatedProbabilitasList = [...probabilitasList, response.data];
      setProbabilitasList(updatedProbabilitasList);
      setNewProbabilitas('');
      setNewKodeKerusakan('');
      fetchData();
      toast.success('Probabilitas berhasil ditambahkan.');
    } catch (error) {
      console.error('Error adding probabilitas:', (error as Error).message);
      toast.error('Terjadi kesalahan saat menambah probabilitas.');
    }
  };

  const openEditForm = (probabilitas: ProbabilitasType) => {
    setEditingProbabilitas(probabilitas);
  };

  const closeEditForm = () => {
    setEditingProbabilitas(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (value: string) => {
    setSortOrder(value);
  };

  const items = [
    { title: 'Dashboard', href: '/' },
    { title: 'Probabilitas Kendaraan' },
  ].map(({ href, title }) => (
    <BreadcrumbItem key={title}>
      {href ? (
        <Link
          className='font-medium text-muted-foreground decoration-muted-foreground decoration-dashed underline-offset-4 hover:text-foreground hover:decoration-solid'
          to={href}
        >
          {title}
        </Link>
      ) : (
        <span className='font-medium text-muted-foreground'>{title}</span>
      )}
    </BreadcrumbItem>
  ));

  return (
    <Layout fadedBelow fixedHeight>
      <LayoutHeader>
        <div className='flex items-center justify-between w-full pl-2 space-x-4 lg:p-b- lg:ml-auto'>
          <Breadcrumb>{items}</Breadcrumb>
          <ThemeSwitch />
        </div>
      </LayoutHeader>

      <LayoutBody className='flex flex-col pt-0' fixedHeight>
        <div className='flex items-end justify-between gap-4 my-4 sm:my-0 sm:items-center'>
          <div className='flex flex-col gap-4 grow sm:my-4 sm:flex-row'>
            <Input
              placeholder='Search...'
              className='w-full h-9'
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <Select
            value={sortOrder}
            onValueChange={handleSortChange}
          >
            <SelectTrigger className='w-16'>
              <SelectValue>Sort</SelectValue>
            </SelectTrigger>
            <SelectContent align='end'>
              <SelectItem value='ascending'>Ascending</SelectItem>
              <SelectItem value='descending'>Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Separator className='shadow' />
        <div className='my-4'>
          <h2 className='mb-4 text-lg font-medium'>Tambah Probabilitas</h2>
          <div className='flex flex-col gap-2 lg:flex-row'>
            <Input
              placeholder='Kode Kerusakan'
              value={newKodeKerusakan}
              onChange={(e) => setNewKodeKerusakan(e.target.value)}
            />
            <Input
              placeholder='Probabilitas'
              value={newProbabilitas}
              onChange={(e) => setNewProbabilitas(e.target.value)}
            />
            <Button onClick={handleAddProbabilitas}>Tambah</Button>
          </div>
        </div>

        <Table className='min-w-full bg-transparent rounded-md'>
          <TableHeader>
            <TableRow>
              <TableHead className='py-3 pr-6 text-xs font-medium tracking-wider text-left text-gray-500 uppercase rounded-md'>
                Kode Probabilitas
              </TableHead>
              <TableHead className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase rounded-md'>
                Probabilitas
              </TableHead>
              <TableHead className='py-3 pr-12 text-xs font-medium tracking-wider text-right text-gray-500 uppercase rounded-md'>
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className='bg-transparent divide-y'>
            {filteredProbabilitas.map(probabilitas => (
              <ProbabilitasRow
                key={probabilitas.id}
                probabilitas={probabilitas}
                editingProbabilitas={editingProbabilitas}
                onEdit={openEditForm}
                onDelete={handleDeleteProbabilitas}
                onSave={handleEditProbabilitas}
                onCancel={closeEditForm}
              />
            ))}
          </TableBody>
        </Table>
      </LayoutBody>
    </Layout>
  );
}

interface ProbabilitasRowProps {
  probabilitas: ProbabilitasType;
  editingProbabilitas: ProbabilitasType | null;
  onEdit: (probabilitas: ProbabilitasType) => void;
  onDelete: (id: number) => void;
  onSave: () => void;
  onCancel: () => void;
}

function ProbabilitasRow({ probabilitas, editingProbabilitas, onEdit, onDelete, onSave, onCancel }: ProbabilitasRowProps) {
  const isEditing = editingProbabilitas && editingProbabilitas.id === probabilitas.id;

  const handleEdit = () => {
    onEdit(probabilitas);
  };

  const handleSave = () => {
    onSave();
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleDelete = () => {
    onDelete(probabilitas.id);
  };

  return (
    <TableRow>
      <TableCell className='py-4 pr-6 text-sm text-gray-500 rounded-md whitespace-nowrap'>
        {probabilitas.kode_kerusakan}
      </TableCell>
      <TableCell className='px-6 py-4 text-sm text-gray-500 rounded-md whitespace-nowrap'>
        {isEditing ? (
          <Input
            value={editingProbabilitas.probabilitas}
            onChange={(e) => onEdit({ ...editingProbabilitas, probabilitas: e.target.value })}
          />
        ) : (
          probabilitas.probabilitas
        )}
      </TableCell>
      <TableCell className='flex justify-end px-6 py-4 text-sm text-gray-500 rounded-md whitespace-nowrap'>
        {isEditing ? (
          <>
            <Button variant='ghost' onClick={handleSave}>
              Save
            </Button>
            <Button variant='ghost' onClick={handleCancel}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button variant='ghost' onClick={handleEdit}>
              <IconEdit className='w-4 h-4' />
            </Button>
            <Button variant='ghost' onClick={handleDelete}>
              <IconTrash className='w-4 h-4' />
            </Button>
          </>
        )}
      </TableCell>
    </TableRow>
  );
}
