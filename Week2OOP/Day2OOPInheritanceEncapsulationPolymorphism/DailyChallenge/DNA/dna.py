"""Daily Challenge Gold: DNA.

Gene -> Chromosome (10 genes) -> DNA (10 chromosomes) -> Organism.
Every level has its own mutate() that calls the level below it.
A population of organisms mutates generation after generation until one of
them has a DNA made only of 1s.
"""

import random

GENES_PER_CHROMOSOME = 10
CHROMOSOMES_PER_DNA = 10


class Gene:
    def __init__(self, value=None):
        self.value = random.choice([0, 1]) if value is None else value

    def mutate(self):
        self.value = 1 - self.value  # 0 becomes 1, 1 becomes 0

    def __repr__(self):
        return str(self.value)


class Chromosome:
    def __init__(self, genes=None):
        self.genes = genes or [Gene() for _ in range(GENES_PER_CHROMOSOME)]

    def mutate(self, probability):
        for gene in self.genes:
            if random.random() < probability:
                gene.mutate()

    def ones(self):
        return sum(gene.value for gene in self.genes)

    def copy(self):
        return Chromosome([Gene(gene.value) for gene in self.genes])

    def __repr__(self):
        return "".join(str(gene) for gene in self.genes)


class DNA:
    def __init__(self, chromosomes=None):
        self.chromosomes = chromosomes or [Chromosome() for _ in range(CHROMOSOMES_PER_DNA)]

    def mutate(self, probability):
        for chromosome in self.chromosomes:
            chromosome.mutate(probability)

    def ones(self):
        return sum(chromosome.ones() for chromosome in self.chromosomes)

    def is_perfect(self):
        return self.ones() == GENES_PER_CHROMOSOME * CHROMOSOMES_PER_DNA

    def copy(self):
        return DNA([chromosome.copy() for chromosome in self.chromosomes])

    def __repr__(self):
        return " ".join(str(chromosome) for chromosome in self.chromosomes)


class Organism:
    """An organism has a DNA and lives in an environment.

    The environment is the chance (0 to 1) that each gene flips in a generation.
    """

    def __init__(self, environment, dna=None):
        self.environment = environment
        self.dna = dna or DNA()

    def mutate(self):
        """Try a mutated child and keep it only if it is not worse (natural selection)."""
        child = self.dna.copy()
        child.mutate(self.environment)
        if child.ones() >= self.dna.ones():
            self.dna = child

    def fitness(self):
        return self.dna.ones()


def evolve(population_size=30, environment=0.02, max_generations=5000):
    """Mutate every organism once per generation until one DNA is all 1s."""
    population = [Organism(environment) for _ in range(population_size)]
    for generation in range(1, max_generations + 1):
        for organism in population:
            organism.mutate()
        best = max(population, key=Organism.fitness)
        if generation % 50 == 0 or best.dna.is_perfect():
            print(f"Generation {generation:>4}: best organism has {best.fitness()}/100 ones")
        if best.dna.is_perfect():
            return generation, best
    return None, max(population, key=Organism.fitness)


def main():
    random.seed(7)  # same numbers every run, so the output is repeatable
    first = Organism(environment=0.02)
    print("A random DNA:", first.dna)
    print("Ones in it:", first.fitness())
    print()

    generations, best = evolve()
    if generations is None:
        print("No perfect DNA yet. Best:", best.dna)
    else:
        print(f"\nPerfect DNA after {generations} generations:")
        print(best.dna)


if __name__ == "__main__":
    main()
