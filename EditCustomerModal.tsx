import { useEffect, useState } from 'react';
import { TaxRecord, Country, countriesApi, taxesApi } from '@/services/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EditCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: TaxRecord | null;
  onSave: () => void;
}

const EditCustomerModal = ({
  isOpen,
  onClose,
  customer,
  onSave,
}: EditCustomerModalProps) => {
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; country?: string }>({});
  const { toast } = useToast();

  useEffect(() => {
    if (customer) {
      setName(customer.name);
      setCountry(customer.country);
    }
  }, [customer]);

  useEffect(() => {
    if (isOpen) {
      loadCountries();
    }
  }, [isOpen]);

  const loadCountries = async () => {
    setIsLoadingCountries(true);
    try {
      const data = await countriesApi.getAll();
      setCountries(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load countries',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingCountries(false);
    }
  };

  const validate = () => {
    const newErrors: { name?: string; country?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!country) {
      newErrors.country = 'Country is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate() || !customer) return;

    setIsSaving(true);
    try {
      await taxesApi.update(customer.id, {
        ...customer,
        name: name.trim(),
        country,
      });

      toast({
        title: 'Success',
        description: 'Customer updated successfully',
      });

      onSave();
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update customer',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Customer</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              className={errors.name ? 'border-destructive' : ''}
              placeholder="Enter name"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">
              Country <span className="text-destructive">*</span>
            </Label>
            <Select
              value={country}
              onValueChange={(value) => {
                setCountry(value);
                if (errors.country) setErrors({ ...errors, country: undefined });
              }}
              disabled={isLoadingCountries}
            >
              <SelectTrigger
                id="country"
                className={errors.country ? 'border-destructive' : ''}
              >
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingCountries ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : (
                  countries.map((c) => (
                    <SelectItem key={c.id} value={c.name}>
                      {c.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {errors.country && (
              <p className="text-sm text-destructive">{errors.country}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditCustomerModal;
