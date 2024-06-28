import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Layout,
  LayoutBody,
  LayoutHeader,
} from '@/components/custom/layout';
import { Input } from '@/components/ui/input';
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
import { Link } from 'react-router-dom';
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
import { toast } from 'sonner';

export default function Gejala() {
  const [gejalaList, setGejalaList] = useState([]);
  const [filteredGejala, setFilteredGejala] = useState([]);
  const [sortOrder, setSortOrder] = useState('ascending');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingGejala, setEditingGejala] = useState(null);
  const [newGejala, setNewGejala] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterAndSortGejala();
  }, [gejalaList, searchTerm, sortOrder]);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://sistempakar-backendapp-ce3dc310e112.herokuapp.com/admin/symptom');
      setGejalaList(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    filterAndSortGejala(); // Trigger filter and sort when editingGejala changes
  }, [editingGejala]);

  const filterAndSortGejala = () => {
    let filtered = [...gejalaList];

    if (searchTerm) {
      filtered = filtered.filter(gejala =>
        gejala.gejala.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      if (a.kode_gejala && b.kode_gejala) {
        return sortOrder === 'ascending' ? a.kode_gejala.localeCompare(b.kode_gejala) : b.kode_gejala.localeCompare(a.kode_gejala);
      } else {
        return 0;
      }
    });

    setFilteredGejala(sorted);
  };

  const handleDeleteGejala = async (id) => {
    try {
      await axios.delete(`https://sistempakar-backendapp-ce3dc310e112.herokuapp.com/admin/symptom/${id}`);
      setGejalaList(gejalaList.filter(gejala => gejala.id !== id));
      filterAndSortGejala(); // Update filtered list after deletion
      toast('Gejala berhasil dihapus.', { type: 'success' });
    } catch (error) {
      console.error('Error deleting gejala:', error.message);
      toast('Terjadi kesalahan saat menghapus gejala.', { type: 'error' });
    }
  };

  const handleEditGejala = async () => {
    if (!editingGejala) return;
  
    try {
      const response = await axios.put(`https://sistempakar-backendapp-ce3dc310e112.herokuapp.com/admin/symptom/${editingGejala.id}`, editingGejala);
      const updatedGejalaList = gejalaList.map(gejala => (gejala.id === response.data.id ? response.data : gejala));
      setGejalaList(updatedGejalaList);
      setEditingGejala(null);
      fetchData(); // Fetch updated data after edit
      toast('Gejala berhasil diubah.', { type: 'success' });
    } catch (error) {
      console.error('Error editing gejala:', error.message);
      toast('Terjadi kesalahan saat mengubah gejala.', { type: 'error' });
    }
  };
  
  const handleAddGejala = async () => {
    try {
      const response = await axios.post('https://sistempakar-backendapp-ce3dc310e112.herokuapp.com/admin/symptom', {
        gejala: newGejala,
      });
      const updatedGejalaList = [...gejalaList, response.data];
      setGejalaList(updatedGejalaList);
      setNewGejala('');
      fetchData(); // Fetch updated data after add
      toast('Gejala berhasil ditambahkan.', { type: 'success' });
    } catch (error) {
      console.error('Error adding gejala:', error.message);
      toast('Terjadi kesalahan saat menambah gejala.', { type: 'error' });
    }
  };

  const openEditForm = (gejala) => {
    setEditingGejala(gejala);
  };

  const closeEditForm = () => {
    setEditingGejala(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (value) => {
    setSortOrder(value);
  };

  const items = [
    { title: 'Dashboard', href: '/' },
    { title: 'Gejala Kendaraan' },
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
          <h2 className='mb-4 text-lg font-medium'>Tambah Gejala</h2>
          <div className='flex flex-col gap-2 lg:flex-row'>
            <Input
              placeholder='Gejala'
              value={newGejala}
              onChange={(e) => setNewGejala(e.target.value)}
            />
            <Button onClick={handleAddGejala}>Tambah</Button>
          </div>
        </div>

        <Table className='min-w-full bg-transparent rounded-md'>
          <TableHeader>
            <TableRow>
              <TableHead className='py-3 pr-6 text-xs font-medium tracking-wider text-left text-gray-500 uppercase rounded-md'>
                Kode Gejala
              </TableHead>
              <TableHead className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase rounded-md'>
                Gejala
              </TableHead>
              <TableHead className='py-3 pr-12 text-xs font-medium tracking-wider text-right text-gray-500 uppercase rounded-md'>
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className='bg-transparent divide-y'>
            {filteredGejala.map(gejala => (
              <GejalaRow
                key={gejala.id}
                gejala={gejala}
                editingGejala={editingGejala}
                onEdit={openEditForm}
                onDelete={handleDeleteGejala}
                onEditSave={handleEditGejala}
                onCancelEdit={closeEditForm}
              />
            ))}
          </TableBody>
        </Table>
      </LayoutBody>
    </Layout>
  );
}

function GejalaRow({ gejala, editingGejala, onEdit, onDelete, onEditSave, onCancelEdit }) {
  const isEditing = editingGejala && editingGejala.id === gejala.id;

  const handleEdit = () => {
    onEdit(gejala);
  };

  const handleDelete = () => {
    onDelete(gejala.id);
  };

  const handleSave = async () => {
    try {
      await onEditSave();
    } catch (error) {
      console.error('Error saving gejala:', error.message);
    }
  };

  const handleCancel = () => {
    onCancelEdit();
  };

  return (
    <TableRow>
      <TableCell className='py-4 pr-6 text-sm text-gray-500 rounded-md whitespace-nowrap'>
        {gejala.kode_gejala}
      </TableCell>
      <TableCell className='px-6 py-4 text-sm text-gray-500 rounded-md whitespace-nowrap'>
        {isEditing ? (
          <Input
            value={editingGejala.gejala}
            onChange={(e) => onEdit({ ...editingGejala, gejala: e.target.value })}
          />
        ) : (
          gejala.gejala
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