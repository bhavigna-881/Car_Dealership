import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchVehicles, addVehicle, updateVehicle, deleteVehicle, restockVehicle } from '../store/slices/vehicleSlice';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { PencilSimple, Trash, Plus, Package } from '@phosphor-icons/react';
import { useToast } from '../hooks/use-toast';
import type { Vehicle } from '../types';

const CATEGORIES = ['ALL', 'PREMIUM', 'COUPE', 'HYPERCAR', 'SUPERCAR', 'CABRIOLET', 'SUV'];

export function Admin() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((state) => state.vehicles);
  const { toast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    category: '',
    price: '',
    quantity: '',
  });

  useEffect(() => {
    dispatch(fetchVehicles());
  }, [dispatch]);

  const handleOpenForm = (vehicle?: Vehicle) => {
    if (vehicle) {
      setEditingVehicle(vehicle);
      setFormData({
        make: vehicle.make,
        model: vehicle.model,
        category: vehicle.category,
        price: vehicle.price.toString(),
        quantity: vehicle.quantity.toString(),
      });
    } else {
      setEditingVehicle(null);
      setFormData({ make: '', model: '', category: '', price: '', quantity: '' });
    }
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      make: formData.make,
      model: formData.model,
      category: formData.category,
      price: Number(formData.price),
      quantity: Number(formData.quantity),
    };

    try {
      if (editingVehicle) {
        await dispatch(updateVehicle({ id: editingVehicle.id, data: payload })).unwrap();
        toast({ title: 'Vehicle Updated', description: `${payload.make} ${payload.model} updated successfully.` });
      } else {
        await dispatch(addVehicle(payload)).unwrap();
        toast({ title: 'Vehicle Added', description: `${payload.make} ${payload.model} added to inventory.` });
      }
      setIsFormOpen(false);
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to save vehicle details.' });
    }
  };

  const confirmDelete = (id: string) => {
    setDeletingId(id);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await dispatch(deleteVehicle(deletingId)).unwrap();
      toast({ title: 'Vehicle Deleted', description: 'The vehicle was permanently removed from inventory.' });
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete vehicle.' });
    } finally {
      setIsDeleteOpen(false);
      setDeletingId(null);
    }
  };

  const handleRestock = async (id: string) => {
    try {
      await dispatch(restockVehicle({ id, amount: 1 })).unwrap();
      toast({ title: 'Stock Replenished', description: 'Increased vehicle quantity by 1.' });
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to restock vehicle.' });
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight text-white">Admin Dashboard</h1>
          <p className="text-brand-gray mt-2">Manage vehicle inventory, pricing, and stock levels.</p>
        </div>
        <Button onClick={() => handleOpenForm()} className="bg-[#f7f3e8] hover:bg-[#f7f3e8]/90 text-black font-semibold h-11 px-6 rounded-lg gap-2">
          <Plus size={20} weight="bold" /> Add Vehicle
        </Button>
      </div>

      <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-white/70 h-12">Make & Model</TableHead>
              <TableHead className="text-white/70">Category</TableHead>
              <TableHead className="text-white/70">Price</TableHead>
              <TableHead className="text-white/70">Stock</TableHead>
              <TableHead className="text-right text-white/70">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-white/10">
                <TableCell colSpan={5} className="text-center py-10 text-white/50">Loading inventory...</TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow className="border-white/10">
                <TableCell colSpan={5} className="text-center py-10 text-white/50">No vehicles found.</TableCell>
              </TableRow>
            ) : (
              items.map((vehicle) => (
                <TableRow key={vehicle.id} className="border-white/5 hover:bg-white/5 transition-colors">
                  <TableCell className="font-medium text-white">{vehicle.make} {vehicle.model}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-white/5 text-brand-gray border-white/10">
                      {vehicle.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-white">${vehicle.price.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={vehicle.quantity > 0 ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}>
                      {vehicle.quantity} In Stock
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleRestock(vehicle.id)} className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10" title="Restock +1">
                        <Package size={18} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleOpenForm(vehicle)} className="text-white/70 hover:text-white hover:bg-white/10" title="Edit">
                        <PencilSimple size={18} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => confirmDelete(vehicle.id)} className="text-red-400 hover:text-red-300 hover:bg-red-400/10" title="Delete">
                        <Trash size={18} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="bg-[#0a0a0a] border-white/10 text-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-heading font-bold">{editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="make" className="text-brand-gray">Make</Label>
                <Input id="make" required className="bg-white/5 border-white/10 focus-visible:ring-[#51158c]" value={formData.make} onChange={(e) => setFormData({ ...formData, make: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model" className="text-brand-gray">Model</Label>
                <Input id="model" required className="bg-white/5 border-white/10 focus-visible:ring-[#51158c]" value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category" className="text-brand-gray">Category</Label>
              <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
                <SelectTrigger className="bg-white/5 border-white/10 focus:ring-[#51158c]">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-[#151515] border-white/10 text-white">
                  {CATEGORIES.filter(c => c !== 'ALL').map(cat => (
                    <SelectItem key={cat} value={cat} className="hover:bg-white/10 focus:bg-white/10 focus:text-white cursor-pointer">{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-brand-gray">Price ($)</Label>
                <Input id="price" type="number" min="0" required className="bg-white/5 border-white/10 focus-visible:ring-[#51158c]" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-brand-gray">Stock Quantity</Label>
                <Input id="quantity" type="number" min="0" required className="bg-white/5 border-white/10 focus-visible:ring-[#51158c]" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} />
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)} className="hover:bg-white/10 hover:text-white">Cancel</Button>
              <Button type="submit" className="bg-[#51158c] hover:bg-[#51158c]/90 text-white">{editingVehicle ? 'Save Changes' : 'Add Vehicle'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="bg-[#0a0a0a] border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-brand-gray">
              This action cannot be undone. This will permanently delete the vehicle from your inventory database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-white/10 hover:bg-white/10 hover:text-white">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white border-none">Delete Vehicle</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
