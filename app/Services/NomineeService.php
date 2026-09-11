<?php

namespace App\Services;

use App\Models\Nominee;
use App\Repositories\Contracts\NomineeRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Validation\ValidationException;

class NomineeService
{
    public function __construct(
        protected NomineeRepositoryInterface $nomineeRepository
    ) {}

    public function getAll(): Collection
    {
        return $this->nomineeRepository->all();
    }

    public function getByCategory(int $categoryId): Collection
    {
        return $this->nomineeRepository->getByCategory($categoryId);
    }

    public function getById(int $id): ?Nominee
    {
        return $this->nomineeRepository->findById($id);
    }

    public function create(array $data): Nominee
    {
        if ($this->nomineeRepository->exists($data['category_id'], $data['employee_id'])) {
            throw ValidationException::withMessages([
                'employee_id' => 'Karyawan ini sudah terdaftar sebagai nominasi pada kategori yang dipilih.'
            ]);
        }

        return $this->nomineeRepository->create($data);
    }

    /**
     * Create multiple nominees for a category in one batch.
     *
     * @param int $categoryId
     * @param array<int> $employeeIds
     * @param string|null $description
     * @return int Count of newly added nominees
     */
    public function createBatch(int $categoryId, array $employeeIds, ?string $description = null): int
    {
        $maxOrder = Nominee::where('category_id', $categoryId)->max('order') ?? 0;
        $createdCount = 0;

        foreach ($employeeIds as $employeeId) {
            $empId = (int) $employeeId;
            if (!$this->nomineeRepository->exists($categoryId, $empId)) {
                $maxOrder++;
                $this->nomineeRepository->create([
                    'category_id' => $categoryId,
                    'employee_id' => $empId,
                    'description' => $description,
                    'order' => $maxOrder,
                ]);
                $createdCount++;
            }
        }

        return $createdCount;
    }

    public function update(int $id, array $data): bool
    {
        $nominee = $this->nomineeRepository->findById($id);
        if (!$nominee) {
            return false;
        }

        if (
            isset($data['category_id'], $data['employee_id']) &&
            ($data['category_id'] !== $nominee->category_id || $data['employee_id'] !== $nominee->employee_id)
        ) {
            if ($this->nomineeRepository->exists($data['category_id'], $data['employee_id'])) {
                throw ValidationException::withMessages([
                    'employee_id' => 'Karyawan ini sudah terdaftar sebagai nominasi pada kategori yang dipilih.'
                ]);
            }
        }

        return $this->nomineeRepository->update($id, $data);
    }

    public function delete(int $id): bool
    {
        return $this->nomineeRepository->delete($id);
    }
}
