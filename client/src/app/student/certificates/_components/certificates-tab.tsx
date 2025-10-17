'use client';

import {
  AlertCircle,
  Archive,
  Award,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Copy,
  Download,
  Edit,
  ExternalLink,
  FileSpreadsheet,
  FileText,
  Filter,
  Grid3x3,
  Linkedin,
  Link as LinkIcon,
  List,
  Loader,
  Mail,
  MoreVertical,
  RefreshCw,
  Search,
  Share2,
  Star,
  Trash2,
  Twitter,
  X,
  ZoomIn,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';

import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ErrorState } from '@/components/ui/error-state';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import { ScrollArea } from '@/components/ui/scroll-area';
import {
  useBulkArchive,
  useBulkDelete,
  useCertificates,
  useDeleteCertificate,
  useToggleArchive,
  useToggleFavorite,
  useUpdateNotes,
} from '../hooks';
import type {
  Certificate,
  GridColumns,
  SortOption,
  ViewMode,
} from '../schemas/certificate.schema';
import { useCertificatesStore } from '../store/certificate.store';

const isExpiringSoon = (expiryDate: string | null): boolean => {
  if (!expiryDate) return false;
  const expiry = new Date(expiryDate);
  const now = new Date();
  const daysUntilExpiry = Math.floor(
    (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
};

const isExpired = (expiryDate: string | null): boolean => {
  if (!expiryDate) return false;

  return new Date(expiryDate) < new Date();
};

function CertificatesSearchBar({ allTags }: { allTags: string[] }) {
  const {
    searchQuery,
    setSearchQuery,
    selectedTag,
    setSelectedTag,
    sortOption,
    setSortOption,
  } = useCertificatesStore();

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [debouncedSearch] = useDebounce(localSearch, 500);

  useEffect(() => {
    setSearchQuery(debouncedSearch);
  }, [debouncedSearch, setSearchQuery]);

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <div className="relative flex-1">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="Search certificates..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex gap-2">
        <Select
          value={selectedTag || 'all'}
          onValueChange={(val) => setSelectedTag(val === 'all' ? null : val)}
        >
          <SelectTrigger className="">
            <Filter className="h-4 w-4" />
            <SelectValue placeholder="Filter by tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tags</SelectItem>
            {allTags.map((tag) => (
              <SelectItem key={tag} value={tag}>
                {tag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sortOption}
          onValueChange={(val) => setSortOption(val as SortOption)}
        >
          <SelectTrigger className="">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-desc">Newest First</SelectItem>
            <SelectItem value="date-asc">Oldest First</SelectItem>
            <SelectItem value="title-asc">Title A-Z</SelectItem>
            <SelectItem value="title-desc">Title Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function CertificatesViewControls({
  onBulkArchive,
  onBulkDelete,
}: {
  onBulkArchive: () => void;
  onBulkDelete: () => void;
}) {
  const {
    viewMode,
    setViewMode,
    gridColumns,
    setGridColumns,
    showFavoritesOnly,
    toggleFavoritesOnly,
    showArchivedOnly,
    toggleArchivedOnly,
    selectedIds,
    clearSelection,
  } = useCertificatesStore();

  const selectedCount = selectedIds.size;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex gap-1 rounded-md border p-1">
        <Button
          variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('grid')}
          className="h-7 px-3"
        >
          <Grid3x3 className="h-4 w-4" />
        </Button>

        <Button
          variant={viewMode === 'list' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('list')}
          className="h-7 px-3"
        >
          <List className="h-4 w-4" />
        </Button>
      </div>

      {viewMode === 'grid' && (
        <Select
          value={String(gridColumns)}
          onValueChange={(val) => setGridColumns(Number(val) as GridColumns)}
        >
          <SelectTrigger className="">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2">2 Columns</SelectItem>
            <SelectItem value="3">3 Columns</SelectItem>
            <SelectItem value="4">4 Columns</SelectItem>
          </SelectContent>
        </Select>
      )}

      <Button
        variant={showFavoritesOnly ? 'default' : 'outline'}
        size="sm"
        onClick={toggleFavoritesOnly}
      >
        <Star className="h-4 w-4" />
        Favorites
      </Button>

      <Button
        variant={showArchivedOnly ? 'default' : 'outline'}
        size="sm"
        onClick={toggleArchivedOnly}
      >
        <Archive className="h-4 w-4" />
        {showArchivedOnly ? 'Exit Archive' : 'Archived'}
      </Button>

      <div className="flex-1" />

      {selectedCount > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">
            {selectedCount} selected
          </span>
          <Button variant="outline" size="sm" onClick={onBulkArchive}>
            <Archive className="h-4 w-4" />
            Archive
          </Button>

          <Button variant="outline" size="sm" onClick={onBulkDelete}>
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={clearSelection}>
                <X className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Clear</TooltipContent>
          </Tooltip>
        </div>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => toast.info('Exporting as CSV...')}>
            <FileSpreadsheet className="h-4 w-4" />
            Export as CSV
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => toast.info('Exporting as PDF...')}>
            <FileText className="h-4 w-4" />
            Export as PDF
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function CertificatesSelectAll({
  currentCertificateIds,
}: {
  currentCertificateIds: string[];
}) {
  const { selectedIds, selectAll } = useCertificatesStore();
  const isAllSelected =
    currentCertificateIds.length > 0 &&
    currentCertificateIds.every((id) => selectedIds.has(id));

  return (
    <div className="flex items-center gap-2">
      <Checkbox
        checked={isAllSelected}
        onCheckedChange={() => selectAll(currentCertificateIds)}
      />
      <span className="text-muted-foreground text-sm">
        Select All on Page ({currentCertificateIds.length})
      </span>
    </div>
  );
}

function CertificatesPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="text-muted-foreground hidden flex-1 text-sm sm:inline">
        Showing {startItem}-{endItem} of {totalItems} certificate(s)
      </div>

      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              onPageSizeChange(Number(value));
              onPageChange(1);
            }}
          >
            <SelectTrigger className="">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[6, 12, 24, 48].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => onPageChange(1)}
                  disabled={currentPage <= 1}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>First Page</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage >= totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Last Page</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

function CertificateDetailsDialog({
  certificate,
  open,
  onOpenChange,
  onDownload,
  onShare,
  onVerify,
}: {
  certificate: Certificate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownload: (cert: Certificate) => void;
  onShare: (cert: Certificate) => void;
  onVerify: (cert: Certificate) => void;
}) {
  if (!certificate) return null;

  const expired = isExpired(certificate.expiryDate);
  const expiringSoon = isExpiringSoon(certificate.expiryDate);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            {certificate.title}
          </DialogTitle>
          <DialogDescription>
            Certificate Details & Verification
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="aspect-video w-full overflow-hidden rounded-lg border">
            <img
              src={certificate.imageUrl!}
              alt={certificate.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="grid gap-4">
            <div className="flex items-start gap-2">
              <FileText className="text-muted-foreground mt-1 h-4 w-4 flex-shrink-0" />
              <div>
                <p className="font-semibold">Issuer</p>
                <p className="text-muted-foreground text-sm">
                  {certificate.issuer}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Calendar className="text-muted-foreground mt-1 h-4 w-4 flex-shrink-0" />
              <div>
                <p className="font-semibold">Issue Date</p>
                <p className="text-muted-foreground text-sm">
                  {certificate.issueDate}
                </p>
              </div>
            </div>

            {certificate.expiryDate && (
              <div className="flex items-start gap-2">
                <AlertCircle className="text-muted-foreground mt-1 h-4 w-4 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold">Expiry Date</p>
                  <div className="flex items-center gap-2">
                    <p className="text-muted-foreground text-sm">
                      {certificate.expiryDate}
                    </p>
                    {expired && (
                      <Badge variant="destructive" className="text-xs">
                        Expired
                      </Badge>
                    )}
                    {expiringSoon && !expired && (
                      <Badge variant="outline" className="text-xs">
                        Expiring Soon
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div>
              <p className="mb-2 font-semibold">Skills & Topics</p>
              <div className="flex flex-wrap gap-2">
                {certificate.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {certificate.notes && (
              <div className="text-muted-foreground flex items-center gap-1 text-xs">
                <Edit className="h-3 w-3" />
                <span>Has notes</span>
              </div>
            )}

            {certificate.credentialId && (
              <div>
                <p className="mb-1 font-semibold">Credential ID</p>
                <code className="bg-muted block rounded px-2 py-1 text-sm">
                  {certificate.credentialId}
                </code>
              </div>
            )}

            <div>
              <p className="mb-1 font-semibold">Description</p>
              <p className="text-muted-foreground text-sm">
                {certificate.description}
              </p>
            </div>

            {certificate.notes && (
              <div>
                <p className="mb-1 font-semibold">Notes</p>
                <p className="text-muted-foreground text-sm">
                  {certificate.notes}
                </p>
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="flex flex-row items-end justify-end gap-2">
          <Button onClick={() => onDownload(certificate)}>
            <Download className="h-4 w-4" />
            Download
          </Button>
          <Button onClick={() => onShare(certificate)} variant="secondary">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button onClick={() => onVerify(certificate)} variant="outline">
            <ExternalLink className="h-4 w-4" />
            Verify
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ShareDialog({
  certificate,
  open,
  onOpenChange,
}: {
  certificate: Certificate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (!certificate) return;
    const link = `https://certificates.app/verify/${certificate.credentialId}`;

    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success('Link copied to clipboard');

    setTimeout(() => setCopied(false), 2000);
  };

  if (!certificate) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Certificate</DialogTitle>
          <DialogDescription>
            Share your certificate with others
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              readOnly
              value={`https://certificates.app/verify/${certificate.credentialId}`}
              className="flex-1"
            />
            <Button onClick={handleCopyLink} size="icon" variant="outline">
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => toast.info('Opening email client...')}
            >
              <Mail className="h-4 w-4" />
              Email
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => toast.info('Sharing to LinkedIn...')}
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => toast.info('Sharing to Twitter...')}
            >
              <Twitter className="h-4 w-4" />
              Twitter
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleCopyLink}
            >
              <LinkIcon className="h-4 w-4" />
              Copy Link
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EditNotesDialog({
  certificate,
  open,
  onOpenChange,
  onSave,
  isPending,
}: {
  certificate: Certificate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (notes: string) => void;
  isPending: boolean;
}) {
  const [notes, setNotes] = useState(certificate?.notes || '');

  useEffect(() => {
    if (certificate) {
      setNotes(certificate.notes || '');
    }
  }, [certificate]);

  const handleSave = () => {
    onSave(notes);
  };

  if (!certificate) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Notes</DialogTitle>
          <DialogDescription>
            Add notes or description for {certificate.title}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mr-3">
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="max-h-[30vh] min-h-[120px] resize-none"
            placeholder="Add your notes here..."
            disabled={isPending}
          />
        </ScrollArea>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Save Notes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  isPending,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  isPending: boolean;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{title}"? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive hover:bg-destructive/90"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function CertificateCard({
  certificate,
  isSelected,
  onSelect,
  onCardClick,
  onToggleFavorite,
  onDownload,
  onShare,
  onVerify,
  onArchive,
  onDelete,
  onEditNotes,
  viewMode,
  isPendingFavorite,
  isPendingArchive,
}: {
  certificate: Certificate;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onCardClick: (cert: Certificate) => void;
  onToggleFavorite: (id: string) => void;
  onDownload: (cert: Certificate) => void;
  onShare: (cert: Certificate) => void;
  onVerify: (cert: Certificate) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onEditNotes: (cert: Certificate) => void;
  viewMode: ViewMode;
  isPendingFavorite: boolean;
  isPendingArchive: boolean;
}) {
  const expired = isExpired(certificate.expiryDate);
  const expiringSoon = isExpiringSoon(certificate.expiryDate);
  const { showArchivedOnly } = useCertificatesStore();

  if (viewMode === 'list') {
    return (
      <Card className="overflow-hidden transition-shadow hover:shadow-md">
        <CardContent className="flex gap-4 p-4">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onSelect(certificate.id)}
            className="mt-1"
          />
          <div
            className="h-28 w-48 flex-shrink-0 cursor-pointer overflow-hidden rounded-md"
            onClick={() => onCardClick(certificate)}
          >
            <img
              src={certificate.imageUrl!}
              alt={certificate.title}
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-semibold">{certificate.title}</h3>
                <p className="text-muted-foreground text-xs">
                  {certificate.issuer} • {certificate.issueDate}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(certificate.id);
                  }}
                  disabled={isPendingFavorite}
                >
                  <Star
                    className={cn(
                      'h-4 w-4',
                      certificate.isFavorite &&
                        'fill-yellow-400 text-yellow-400'
                    )}
                  />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEditNotes(certificate)}>
                      <Edit className="h-4 w-4" />
                      Edit Notes
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => onArchive(certificate.id)}
                      disabled={isPendingArchive}
                    >
                      <Archive className="h-4 w-4" />
                      {showArchivedOnly ? 'Unarchive' : 'Archive'}
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(certificate.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="text-destructive hover:text-destructive h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="mb-2 flex flex-wrap gap-2">
              {certificate.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}

              {certificate.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{certificate.tags.length - 3}
                </Badge>
              )}
            </div>

            {certificate.notes && (
              <p className="text-muted-foreground flex items-center gap-1 text-xs">
                <Edit className="h-3 w-3" />
                Has notes
              </p>
            )}

            {(expired || expiringSoon) && (
              <Alert
                variant={expired ? 'destructive' : 'default'}
                className="mb-2 py-2"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  {expired ? 'Expired' : 'Expiring soon'} on{' '}
                  {certificate.expiryDate}
                </AlertDescription>
              </Alert>
            )}

            <div className="mt-2 flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload(certificate);
                }}
              >
                <Download className="h-3 w-3" />
                Download
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onShare(certificate);
                }}
              >
                <Share2 className="h-3 w-3" />
                Share
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onVerify(certificate);
                }}
              >
                <ExternalLink className="h-3 w-3" />
                Verify
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group relative overflow-hidden pt-0 transition-shadow hover:shadow-md">
      <div className="absolute top-2 left-2 z-10">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onSelect(certificate.id)}
          className={cn(
            'bg-background transition-opacity',
            isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          )}
        />
      </div>

      <div className="absolute top-2 right-2 z-10 flex gap-1">
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(certificate.id);
          }}
          disabled={isPendingFavorite}
        >
          <Star
            className={cn(
              'h-4 w-4',
              certificate.isFavorite && 'fill-yellow-400 text-yellow-400'
            )}
          />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEditNotes(certificate)}>
              <Edit className="h-4 w-4" />
              Edit Notes
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onArchive(certificate.id)}
              disabled={isPendingArchive}
            >
              <Archive className="h-4 w-4" />
              {showArchivedOnly ? 'Unarchive' : 'Archive'}
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => onDelete(certificate.id)}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div
        className="relative aspect-video w-full cursor-pointer overflow-hidden"
        onClick={() => onCardClick(certificate)}
      >
        <img
          src={certificate.imageUrl!}
          alt={certificate.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />

        <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
          <ZoomIn className="h-8 w-8 text-white" />
        </div>
      </div>

      <CardContent className="flex-1 space-y-2 p-4">
        <div>
          <h3 className="line-clamp-2 font-semibold">{certificate.title}</h3>
          <p className="text-muted-foreground text-xs">
            {certificate.issuer} • {certificate.issueDate}
          </p>
        </div>

        {(expired || expiringSoon) && (
          <Alert variant={expired ? 'destructive' : 'default'} className="py-1">
            <AlertCircle className="h-3 w-3" />
            <AlertDescription className="text-xs">
              {expired ? 'Expired' : 'Expiring soon'}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-wrap gap-2">
          {certificate.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {certificate.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{certificate.tags.length - 3}
            </Badge>
          )}
        </div>

        {certificate.notes && (
          <p className="text-muted-foreground flex items-center gap-1 text-xs">
            <Edit className="h-3 w-3" />
            Has notes
          </p>
        )}

        {certificate.credentialId && (
          <p className="text-muted-foreground truncate text-xs">
            ID: {certificate.credentialId}
          </p>
        )}
      </CardContent>

      <CardFooter className="gap-2 p-4 pt-0">
        <Button
          variant="secondary"
          className="flex-1"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onDownload(certificate);
          }}
        >
          <Download className="h-4 w-4" />
          Download
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onShare(certificate);
          }}
        >
          <Share2 className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onVerify(certificate);
          }}
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

function CertificatesGrid({
  certificates,
  viewMode,
  gridColumns,
  onCardClick,
  onToggleFavorite,
  onDownload,
  onShare,
  onVerify,
  onArchive,
  onDelete,
  onEditNotes,
  pendingFavoriteId,
  pendingArchiveId,
}: {
  certificates: Certificate[];
  viewMode: ViewMode;
  gridColumns: GridColumns;
  onCardClick: (cert: Certificate) => void;
  onToggleFavorite: (id: string) => void;
  onDownload: (cert: Certificate) => void;
  onShare: (cert: Certificate) => void;
  onVerify: (cert: Certificate) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onEditNotes: (cert: Certificate) => void;
  pendingFavoriteId: string | null;
  pendingArchiveId: string | null;
}) {
  const { selectedIds, toggleSelectId } = useCertificatesStore();

  const gridColsClass = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  }[gridColumns];

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-2',
        viewMode === 'grid' && gridColsClass
      )}
    >
      {certificates.map((cert) => (
        <CertificateCard
          key={cert.id}
          certificate={cert}
          isSelected={selectedIds.has(cert.id)}
          onSelect={toggleSelectId}
          onCardClick={onCardClick}
          onToggleFavorite={onToggleFavorite}
          onDownload={onDownload}
          onShare={onShare}
          onVerify={onVerify}
          onArchive={onArchive}
          onDelete={onDelete}
          onEditNotes={onEditNotes}
          viewMode={viewMode}
          isPendingFavorite={pendingFavoriteId === cert.id}
          isPendingArchive={pendingArchiveId === cert.id}
        />
      ))}
    </div>
  );
}

function CertificatesEmptyState() {
  const {
    searchQuery,
    selectedTag,
    showFavoritesOnly,
    showArchivedOnly,
    resetFilters,
  } = useCertificatesStore();

  const hasFilters =
    searchQuery || selectedTag || showFavoritesOnly || showArchivedOnly;

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Award className="text-muted-foreground mb-4 h-12 w-12" />
      <h3 className="mb-2 text-lg font-semibold">No certificates found</h3>
      <p className="text-muted-foreground mb-4 text-sm">
        {hasFilters
          ? 'Try adjusting your filters or search criteria'
          : 'You have no certificates yet'}
      </p>
      {hasFilters && (
        <Button onClick={resetFilters} variant="outline">
          Clear Filters
        </Button>
      )}
    </div>
  );
}

export function CertificatesTab() {
  const { data, isLoading, isError, error, refetch, isFetching } =
    useCertificates();
  const {
    mutate: toggleFavorite,
    isPending: isPendingFavorite,
    variables: favoriteVariables,
  } = useToggleFavorite();
  const {
    mutate: toggleArchive,
    isPending: isPendingArchive,
    variables: archiveVariables,
  } = useToggleArchive();
  const { mutate: updateNotes, isPending: isPendingNotes } = useUpdateNotes();
  const { mutate: deleteCertificate, isPending: isPendingDelete } =
    useDeleteCertificate();
  const { mutate: bulkArchive, isPending: isPendingBulkArchive } =
    useBulkArchive();
  const { mutate: bulkDelete, isPending: isPendingBulkDelete } =
    useBulkDelete();

  const {
    viewMode,
    gridColumns,
    page,
    limit,
    setPage,
    setLimit,
    selectedIds,
    clearSelection,
  } = useCertificatesStore();

  const [detailsDialog, setDetailsDialog] = useState<Certificate | null>(null);
  const [shareDialog, setShareDialog] = useState<Certificate | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<Certificate | null>(null);
  const [editNotesDialog, setEditNotesDialog] = useState<Certificate | null>(
    null
  );
  const [isBulkDeleteConfirmOpen, setIsBulkDeleteConfirmOpen] = useState(false);

  const certificates = data?.results || [];
  const pagination = data?.pagination;

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    certificates.forEach((cert) => cert.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }, [certificates]);

  const currentCertificateIds = useMemo(
    () => certificates.map((cert) => cert.id),
    [certificates]
  );

  const handleToggleFavorite = (id: string) => {
    toggleFavorite(id);
  };

  const handleArchive = (id: string) => {
    toggleArchive(id);
  };

  const handleDelete = (id: string) => {
    deleteCertificate(id, {
      onSuccess: () => {
        setDeleteDialog(null);
      },
    });
  };

  const handleSaveNotes = (notes: string) => {
    if (!editNotesDialog) return;
    updateNotes(
      { enrollmentId: editNotesDialog.id, notes },
      {
        onSuccess: () => {
          setEditNotesDialog(null);
        },
      }
    );
  };

  const handleBulkArchive = () => {
    if (selectedIds.size === 0) {
      toast.error('No certificates selected');
      return;
    }
    bulkArchive(Array.from(selectedIds));
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) {
      toast.error('No certificates selected');
      return;
    }
    bulkDelete(Array.from(selectedIds), {
      onSuccess: () => {
        setIsBulkDeleteConfirmOpen(false);
      },
    });
  };

  const handleDownload = (cert: Certificate) => {
    toast.info(`Downloading certificate: ${cert.title}`);
  };

  const handleShare = (cert: Certificate) => {
    setShareDialog(cert);
  };

  const handleVerify = (cert: Certificate) => {
    window.open(cert.verificationUrl, '_blank', 'noopener,noreferrer');
  };

  if (isError) {
    return (
      <ErrorState
        message={error?.message || 'Failed to load certificates'}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-2">
      <CertificatesSearchBar allTags={allTags} />

      <CertificatesViewControls
        onBulkArchive={handleBulkArchive}
        onBulkDelete={() => setIsBulkDeleteConfirmOpen(true)}
      />

      {currentCertificateIds.length > 0 && (
        <CertificatesSelectAll currentCertificateIds={currentCertificateIds} />
      )}

      {isLoading ? (
        <CertificatesGridSkeleton
          viewMode={viewMode}
          gridColumns={gridColumns}
        />
      ) : certificates.length > 0 ? (
        <>
          <div className="relative">
            {isFetching && !isLoading && (
              <div className="bg-background/50 absolute inset-0 z-10 flex items-start justify-center pt-4 backdrop-blur-sm">
                <div className="bg-background flex items-center gap-2 rounded-md border px-4 py-2 shadow-sm">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Updating...</span>
                </div>
              </div>
            )}

            <CertificatesGrid
              certificates={certificates}
              viewMode={viewMode}
              gridColumns={gridColumns}
              onCardClick={setDetailsDialog}
              onToggleFavorite={handleToggleFavorite}
              onDownload={handleDownload}
              onShare={handleShare}
              onVerify={handleVerify}
              onArchive={handleArchive}
              onDelete={(id) => {
                const cert = certificates.find((c) => c.id === id);
                if (cert) setDeleteDialog(cert);
              }}
              onEditNotes={setEditNotesDialog}
              pendingFavoriteId={
                isPendingFavorite ? (favoriteVariables as string) : null
              }
              pendingArchiveId={
                isPendingArchive ? (archiveVariables as string) : null
              }
            />
          </div>

          {pagination && pagination.totalPages > 1 && (
            <CertificatesPagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalResults}
              pageSize={limit}
              onPageChange={setPage}
              onPageSizeChange={setLimit}
            />
          )}
        </>
      ) : (
        <CertificatesEmptyState />
      )}

      <CertificateDetailsDialog
        certificate={detailsDialog}
        open={!!detailsDialog}
        onOpenChange={(open) => !open && setDetailsDialog(null)}
        onDownload={handleDownload}
        onShare={handleShare}
        onVerify={handleVerify}
      />

      <ShareDialog
        certificate={shareDialog}
        open={!!shareDialog}
        onOpenChange={(open) => !open && setShareDialog(null)}
      />

      <DeleteConfirmDialog
        open={!!deleteDialog}
        onOpenChange={(open) => !open && setDeleteDialog(null)}
        onConfirm={() => deleteDialog && handleDelete(deleteDialog.id)}
        title={deleteDialog?.title || ''}
        isPending={isPendingDelete}
      />

      <EditNotesDialog
        certificate={editNotesDialog}
        open={!!editNotesDialog}
        onOpenChange={(open) => !open && setEditNotesDialog(null)}
        onSave={handleSaveNotes}
        isPending={isPendingNotes}
      />

      <AlertDialog
        open={isBulkDeleteConfirmOpen}
        onOpenChange={setIsBulkDeleteConfirmOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Multiple Certificates</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedIds.size} certificate(s)?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPendingBulkDelete}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-destructive hover:bg-destructive/90"
              disabled={isPendingBulkDelete}
            >
              {isPendingBulkDelete ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Delete {selectedIds.size}
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export function CertificatesTabSkeleton() {
  const { viewMode, gridColumns } = useCertificatesStore();

  return (
    <div className="space-y-4">
      <CertificatesSearchBarSkeleton />
      <CertificatesViewControlsSkeleton />
      <CertificatesGridSkeleton viewMode={viewMode} gridColumns={gridColumns} />
      <CertificatesPaginationSkeleton />
    </div>
  );
}

function CertificateCardSkeleton({ viewMode }: { viewMode: ViewMode }) {
  if (viewMode === 'list') {
    return (
      <Card className="overflow-hidden">
        <div className="flex gap-4 p-4">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-28 w-48 rounded-md" />
          <div className="flex-1 space-y-3">
            <div>
              <Skeleton className="mb-2 h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-24" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col overflow-hidden pt-0">
      <Skeleton className="aspect-video w-full" />
      <CardContent className="flex-1 space-y-2 p-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-24" />
        </div>
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
      <CardFooter className="gap-2 p-4 pt-0">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
      </CardFooter>
    </Card>
  );
}

function CertificatesGridSkeleton({
  viewMode,
  gridColumns,
}: {
  viewMode: ViewMode;
  gridColumns: GridColumns;
}) {
  const gridColsClass = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  }[gridColumns];

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-2',
        viewMode === 'grid' && gridColsClass
      )}
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <CertificateCardSkeleton key={i} viewMode={viewMode} />
      ))}
    </div>
  );
}

function CertificatesSearchBarSkeleton() {
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <Skeleton className="h-10 flex-1" />
      <Skeleton className="h-10 w-full sm:w-[180px]" />
      <Skeleton className="h-10 w-full sm:w-[180px]" />
    </div>
  );
}

function CertificatesViewControlsSkeleton() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Skeleton className="h-9 w-20" />
      <Skeleton className="h-9 w-[120px]" />
      <Skeleton className="h-9 w-24" />
      <Skeleton className="h-9 w-24" />
      <div className="flex-1" />
      <Skeleton className="h-9 w-24" />
    </div>
  );
}

function CertificatesPaginationSkeleton() {
  return (
    <div className="flex items-center justify-between px-2 py-4">
      <Skeleton className="h-5 w-48" />
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-8 w-[70px]" />
        </div>
        <Skeleton className="h-5 w-24" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
}
