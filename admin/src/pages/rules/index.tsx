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
import { Separator } from '@radix-ui/react-dropdown-menu';

interface Rule {
  id: number;
  rule_kondisi: string;
  hasil: string;
}

export default function Rule() {
  const [ruleList, setRuleList] = useState<Rule[]>([]);
  const [filteredRules, setFilteredRules] = useState<Rule[]>([]);
  const [sortOrder, setSortOrder] = useState<'ascending' | 'descending'>('ascending');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [editingRuleId, setEditingRuleId] = useState<number | null>(null);
  const [ruleKondisi, setRuleKondisi] = useState<string>('');
  const [hasil, setHasil] = useState<string>('');

  const fetchData = async () => {
    try {
      const response = await axios.get<Rule[]>('https://sistempakar-backendapp-ce3dc310e112.herokuapp.com/admin/rule');
      setRuleList(response.data || []);
    } catch (error) {
      console.error('Error fetching data:', (error as Error).message);
    }
  };

  useEffect(() => {
    const filterAndSortRules = () => {
      let filtered = [...ruleList];

      if (searchTerm) {
        filtered = filtered.filter(rule =>
          rule.hasil.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      const sorted = [...filtered].sort((a, b) => {
        if (a.hasil && b.hasil) {
          return sortOrder === 'ascending' ? a.hasil.localeCompare(b.hasil) : b.hasil.localeCompare(a.hasil);
        } else {
          return 0;
        }
      });

      setFilteredRules(sorted);
    };

    fetchData();
    filterAndSortRules();
  }, [ruleList, searchTerm, sortOrder]); 

  const handleDeleteRule = async (id: number) => {
    try {
      await axios.delete(`https://sistempakar-backendapp-ce3dc310e112.herokuapp.com/admin/rule/${id}`);
      setRuleList(ruleList.filter(rule => rule.id !== id));
    } catch (error) {
      console.error('Error deleting rule:', (error as Error).message);
    }
  };

  const handleRuleKondisiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRuleKondisi(e.target.value);
  };

  const handleHasilChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasil(e.target.value);
  };

  const handleSubmitTambah = async () => {
    try {
      const response = await axios.post<Rule>('https://sistempakar-backendapp-ce3dc310e112.herokuapp.com/admin/rule', {
        rule_kondisi: ruleKondisi,
        hasil: hasil
      });
      setRuleList([...ruleList, response.data]);
      setRuleKondisi('');
      setHasil('');
      fetchData(); 
    } catch (error) {
      console.error('Error adding rule:', (error as Error).message);
    }
  };

  const handleEditRule = async (id: number) => {
    try {
      await axios.put(`https://sistempakar-backendapp-ce3dc310e112.herokuapp.com/admin/rule/${id}`, {
        rule_kondisi: ruleKondisi,
        hasil: hasil
      });
      const updatedRuleList = ruleList.map(rule => {
        if (rule.id === id) {
          return { ...rule, rule_kondisi: ruleKondisi, hasil: hasil };
        }
        return rule;
      });
      setRuleList(updatedRuleList);
      setEditingRuleId(null);
      setRuleKondisi('');
      setHasil('');
      fetchData(); 
    } catch (error) {
      console.error('Error editing rule:', (error as Error).message);
    }
  };

  const handleStartEditing = (id: number) => {
    const ruleToEdit = ruleList.find(rule => rule.id === id);
    if (ruleToEdit) {
      setEditingRuleId(id);
      setRuleKondisi(ruleToEdit.rule_kondisi);
      setHasil(ruleToEdit.hasil);
    }
  };

  const handleCancelEditing = () => {
    setEditingRuleId(null);
    setRuleKondisi('');
    setHasil('');
  };

  const items = [
    { title: 'Dashboard', href: '/' },
    { title: 'Rule' },
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
      {/* Header */}
      <LayoutHeader>
        <div className='flex items-center justify-between w-full pl-2 space-x-4 lg:p-b- lg:ml-auto'>
          <Breadcrumb>{items}</Breadcrumb>
        </div>
      </LayoutHeader>

      {/* Body */}
      <LayoutBody className='flex flex-col pt-0' fixedHeight>
        <div className='flex items-end justify-between gap-4 my-4 sm:my-0 sm:items-center'>
          <div className='flex flex-col gap-4 grow sm:my-4 sm:flex-row'>
            <Input
              placeholder='Search...'
              className='w-full h-9'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select
            value={sortOrder}
            onValueChange={(value) => setSortOrder(value as 'ascending' | 'descending')}
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
          <h2 className='mb-4 text-lg font-medium'>Tambah Bobot Gejala</h2>
          <div className='flex flex-col gap-2 lg:flex-row'>
            <Input
              placeholder='Rule Kondisi'
              value={editingRuleId !== null ? '' : ruleKondisi} 
              onChange={handleRuleKondisiChange}
              disabled={!!editingRuleId}
            />
            <Input
              placeholder='Hasil'
              value={editingRuleId !== null ? '' : hasil} 
              onChange={handleHasilChange}
              disabled={!!editingRuleId}
            />
              <Button onClick={handleSubmitTambah}>Tambah</Button>
          </div>
        </div>
        {/* Table */}
        <Table className='min-w-full bg-transparent rounded-md'>
          <TableHeader>
            <TableRow>
              <TableHead className='py-3 pr-6 text-xs font-medium tracking-wider text-left text-gray-500 uppercase rounded-md'>
                Rule Kondisi
              </TableHead>
              <TableHead className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase rounded-md'>
                Hasil
              </TableHead>
              <TableHead className='py-3 pr-12 text-xs font-medium tracking-wider text-right text-gray-500 uppercase rounded-md'>
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className='bg-transparent divide-y'>
            {filteredRules.map((rule) => (
              <TableRow key={rule.id}>
                <TableCell className='py-4 pr-6 text-sm text-gray-500 rounded-md whitespace-nowrap'>
                  {editingRuleId === rule.id ? (
                    <Input
                      value={ruleKondisi}
                      onChange={handleRuleKondisiChange}
                    />
                  ) : (
                    rule.rule_kondisi
                  )}
                </TableCell>
                <TableCell className='px-6 py-4 text-sm text-gray-500 rounded-md whitespace-nowrap'>
                  {editingRuleId === rule.id ? (
                    <Input
                      value={hasil}
                      onChange={handleHasilChange}
                    />
                  ) : (
                    rule.hasil
                  )}
                </TableCell>
                <TableCell className='flex justify-end px-6 py-4 text-sm text-gray-500 rounded-md whitespace-nowrap'>
                  {editingRuleId === rule.id ? (
                    <>
                      <Button variant='ghost' onClick={() => handleEditRule(rule.id)}>Save</Button>
                      <Button variant='ghost' onClick={handleCancelEditing}>Cancel</Button>
                    </>
                  ) : (
                    <>
                      <Button variant='ghost' onClick={() => handleStartEditing(rule.id)}>
                        <IconEdit className='w-4 h-4' />
                      </Button>
                      <Button variant='ghost' onClick={() => handleDeleteRule(rule.id)}>
                        <IconTrash className='w-4 h-4' />
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </LayoutBody>
    </Layout>
  );
}
