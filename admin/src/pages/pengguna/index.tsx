import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
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
import { useToast } from "@/components/ui/use-toast"

interface UserType {
  id: number;
  username: string;
  password: string;
}

export default function UserManagement() {
  const [userList, setUserList] = useState<UserType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const [sortOrder, setSortOrder] = useState('ascending');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const { toast } = useToast()

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://sistempakar-backendapp-ce3dc310e112.herokuapp.com/admin/users');
      setUserList(response.data || []);
    } catch (error) {
      console.error('Error fetching data:', (error as Error).message);
    }
  };

  const filterAndSortUsers = useCallback(() => {
    let filtered = [...userList];

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      if (a.username && b.username) {
        return sortOrder === 'ascending' ? a.username.localeCompare(b.username) : b.username.localeCompare(a.username);
      } else {
        return 0;
      }
    });

    setFilteredUsers(sorted);
  }, [userList, searchTerm, sortOrder]);

  useEffect(() => {
    filterAndSortUsers();
  }, [userList, searchTerm, sortOrder, filterAndSortUsers]);

  const handleDeleteUser = async (id: number) => {
    try {
      await axios.delete(`https://sistempakar-backendapp-ce3dc310e112.herokuapp.com/admin/users/${id}`);
      setUserList(userList.filter(user => user.id !== id));
      filterAndSortUsers();
      toast({
        title: "Sukses",
        description: "User berhasil dihapus",
      })
    } catch (error) {
      console.error('Error deleting user:', (error as Error).message);
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat menghapus user.",
      })
    }
  };

  const handleEditUser = async () => {
    if (!editingUser) return;

    try {
      const response = await axios.put(`https://sistempakar-backendapp-ce3dc310e112.herokuapp.com/admin/users/${editingUser.id}`, {
        username: editingUser.username,
        password: editingUser.password,
      });
      const updatedUserList = userList.map(user => (user.id === response.data.id ? response.data : user));
      setUserList(updatedUserList);
      setEditingUser(null);
      fetchData();
      toast({
        title: "Sukses",
        description: "User berhasil diubah",
      })
    } catch (error) {
      console.error('Error editing user:', (error as Error).message);
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat mengubah user.",
      })
    }
  };

  const handleAddUser = async () => {
    try {
      const response = await axios.post('https://sistempakar-backendapp-ce3dc310e112.herokuapp.com/admin/users', {
        username: newUsername,
        password: newPassword,
      });
      const updatedUserList = [...userList, response.data];
      setUserList(updatedUserList);
      setNewPassword('');
      setNewUsername('');
      fetchData();
      toast({
        title: "Sukses",
        description: "User berhasil ditambahkan",
      })
    } catch (error) {
      console.error('Error adding user:', (error as Error).message);
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat menambah user.",
      })
    }
  };

  const openEditForm = (user: UserType) => {
    setEditingUser(user);
  };

  const closeEditForm = () => {
    setEditingUser(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (value: string) => {
    setSortOrder(value);
  };

  const items = [
    { title: 'Dashboard', href: '/' },
    { title: 'User Management' },
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
          <h2 className='px-2 mb-4 font-medium text-muted-foreground'>Tambah Admin</h2>
          <div className='flex flex-col gap-2 lg:flex-row'>
            <Input
              placeholder='Username'
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
            <Input
              placeholder='Password'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Button onClick={handleAddUser}>Tambah</Button>
          </div>
        </div>

        <Table className='min-w-full bg-transparent rounded-md'>
          <TableHeader>
            <TableRow>
              <TableHead className='py-3 pr-6 text-xs font-medium tracking-wider text-left text-gray-500 uppercase rounded-md'>
                Username
              </TableHead>
              <TableHead className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase rounded-md'>
                Password
              </TableHead>
              <TableHead className='py-3 pr-12 text-xs font-medium tracking-wider text-right text-gray-500 uppercase rounded-md'>
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className='bg-transparent divide-y'>
            {filteredUsers.map(user => (
              <UserRow
                key={user.id}
                user={user}
                editingUser={editingUser}
                onEdit={openEditForm}
                onDelete={handleDeleteUser}
                onSave={handleEditUser}
                onCancel={closeEditForm}
              />
            ))}
          </TableBody>
        </Table>
      </LayoutBody>
    </Layout>
  );
}

interface UserRowProps {
  user: UserType;
  editingUser: UserType | null;
  onEdit: (user: UserType) => void;
  onDelete: (id: number) => void;
  onSave: () => void;
  onCancel: () => void;
}

function UserRow({ user, editingUser, onEdit, onDelete, onSave, onCancel }: UserRowProps) {
  const isEditing = editingUser && editingUser.id === user.id;

  const handleEdit = () => {
    onEdit(user);
  };

  const handleSave = () => {
    onSave();
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleDelete = () => {
    onDelete(user.id);
  };

  return (
    <TableRow>
      <TableCell className='py-4 pr-6 text-sm text-gray-500 rounded-md whitespace-nowrap'>
        {user.username}
      </TableCell>
      <TableCell className='px-6 py-4 text-sm text-gray-500 rounded-md whitespace-nowrap'>
        {isEditing ? (
          <Input
            type='password'
            value={editingUser.password}
            onChange={(e) => onEdit({ ...editingUser, password: e.target.value })}
            maxLength={8}
          />
        ) : (
          '********'
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
